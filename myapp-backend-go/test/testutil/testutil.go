package testutil

import (
	"context"
	"flag"
	"fmt"
	"math/rand"
	"os"
	"time"

	"entgo.io/contrib/entgql"
	"entgo.io/ent/dialect"
	"github.com/99designs/gqlgen/client"
	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/99designs/gqlgen/graphql/handler/transport"
	"github.com/diep-it-dn/fullstack-go-angular/myapp-backend-go/ent"
	"github.com/diep-it-dn/fullstack-go-angular/myapp-backend-go/ent/enttest"
	"github.com/diep-it-dn/fullstack-go-angular/myapp-backend-go/ent/migrate"
	"github.com/diep-it-dn/fullstack-go-angular/myapp-backend-go/graph/resolver"
	"github.com/diep-it-dn/fullstack-go-angular/myapp-backend-go/internal/auth"
	"github.com/diep-it-dn/fullstack-go-angular/myapp-backend-go/internal/config"
	"github.com/diep-it-dn/fullstack-go-angular/myapp-backend-go/internal/initdb"
	"github.com/diep-it-dn/fullstack-go-angular/myapp-backend-go/test/generated"
	"github.com/diep-it-dn/fullstack-go-angular/myapp-backend-go/test/model"
	"github.com/stretchr/testify/suite"
)

const (
	// Authorization name
	Authorization = "Authorization"
	// BearPrefix name
	BearPrefix = "Bearer "
	// DomainName name
	DomainName = "test.com"
	// ID name
	ID = "id"
	// Input name
	Input = "input"
)

// Suite utils
type Suite struct {
	suite.Suite
	*client.Client
	ent *ent.Client
}

// InitUser login with Init User then reuse its token to test other testcases
var InitUser generated.Login

// Setup prepare before running tests
func (s *Suite) Setup() {
	// We manipuate the Args to set them up for the testcases
	// after this test we restore the initial args
	oldArgs := os.Args
	defer func() { os.Args = oldArgs }()
	cases := []struct {
		Name string
		Args []string
	}{
		{"flags set", []string{"--config", "../../internal/config/config.yaml", "--environment", "test"}},
	}
	for _, tc := range cases {
		// this call is required because otherwise flags panics, if args are set between flag.Parse calls
		flag.CommandLine = flag.NewFlagSet(tc.Name, flag.ExitOnError)
		// we need a value to set Args[0] to, cause flag begins parsing at Args[1]
		os.Args = append([]string{tc.Name}, tc.Args...)
	}

	config.Init()

	s.ent = enttest.Open(s.T(), dialect.SQLite,
		fmt.Sprintf("file:%s-%d?mode=memory&cache=shared&_fk=1",
			s.T().Name(), time.Now().UnixNano(),
		),
		enttest.WithMigrateOptions(migrate.WithGlobalUniqueID(true)),
	)

	srv := handler.New(resolver.NewSchema(s.ent))
	srv.AddTransport(transport.POST{})
	srv.Use(entgql.Transactioner{TxOpener: s.ent})

	m := auth.Middleware(s.ent)
	s.Client = client.New(m(srv))

	initdb.InitData(context.Background(), s.ent, config.AppConfig)
	InitUser = s.LoginWithInitUser()
}

// BuildCreatePermissionGroupIn to be reused
func BuildCreatePermissionGroupIn() *model.CreatePermissionGroupIn {
	return &model.CreatePermissionGroupIn{
		Name:        *RandomString(10),
		Description: RandomString(20),
		Permissions: []model.Permission{
			model.PermissionUser,
			model.PermissionPermissionGroup,
		},
	}
}

// CreatePermissionGroup create permission group
func (s *Suite) CreatePermissionGroup(input *model.CreatePermissionGroupIn) (generated.CreatePermissionGroup, error) {
	var resp generated.CreatePermissionGroup
	err := s.Post(generated.CreatePermissionGroupDocument, &resp, client.Var(Input, input), s.AddHeaderAuthAdmin())
	return resp, err
}

// LoginWithInitUser use Init User (is configured in the internal/config/config.yaml)
// that has full permissions to login then keep the response in the global variable to help other testcases, for example use the token to authorize the POST request in other testcases
func (s *Suite) LoginWithInitUser() generated.Login {
	resp, err := s.Login(config.AppConfig.InitUser.Email, config.AppConfig.InitUser.Password)
	if err != nil {
		panic(err)
	}
	return resp
}

// Login login
func (s *Suite) Login(email, password string) (generated.Login, error) {
	input := model.LoginIn{
		Email:    email,
		Password: password,
	}
	var resp generated.Login
	err := s.Post(generated.LoginDocument, &resp, client.Var(Input, &input))

	return resp, err
}

// AddHeaderAuthAdmin add admin authorization header
func (s *Suite) AddHeaderAuthAdmin() client.Option {
	return client.AddHeader(Authorization, BearPrefix+InitUser.Login.TokenPair.Token)
}

// RandomString create a random string with desired length
func RandomString(n int) *string {
	var letter = []rune("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789")

	b := make([]rune, n)
	for i := range b {
		b[i] = letter[rand.Intn(len(letter))]
	}

	s := string(b)
	return &s
}

// RandomEmail create a random email
func RandomEmail() *string {
	s := *RandomString(10) + "@" + DomainName
	return &s
}

// RandomURL create a random URL
func RandomURL() *string {
	s := "http://" + DomainName + "/" + *RandomString(30)
	return &s
}

// RamdomDateStringInPass create a random date in the pass to fake birthday...
func RamdomDateStringInPass() *string {
	randomTime := rand.Int63n(time.Now().Unix()-94608000) + 94608000

	randomNow := time.Unix(randomTime, 0)

	date := randomNow.Format(time.RFC3339)
	return &date
}

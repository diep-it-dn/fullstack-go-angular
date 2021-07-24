package initdb

import (
	"context"
	"database/sql"
	"log"
	"time"

	"entgo.io/ent/dialect"
	entsql "entgo.io/ent/dialect/sql"
	"github.com/diep-it-dn/fullstack-go-angular/myapp-backend-go/ent"
	"github.com/diep-it-dn/fullstack-go-angular/myapp-backend-go/ent/migrate"
	"github.com/diep-it-dn/fullstack-go-angular/myapp-backend-go/graph/model"
	"github.com/diep-it-dn/fullstack-go-angular/myapp-backend-go/internal/config"
	"github.com/diep-it-dn/fullstack-go-angular/myapp-backend-go/internal/permissiongroup"
	"github.com/diep-it-dn/fullstack-go-angular/myapp-backend-go/internal/user"
	"go.uber.org/zap"
)

// ConnectDBAndInitData connect to database and init the data
func ConnectDBAndInitData() *ent.Client {
	appConfig := config.AppConfig

	var client *ent.Client
	var err error
	if appConfig.Database.DriverName == "sqlite3" {
		if config.AppConfig.Debug {
			client, err = ent.Open("sqlite3", appConfig.Database.DatabaseURL, ent.Debug())
		} else {
			client, err = ent.Open("sqlite3", appConfig.Database.DatabaseURL)
		}
	} else if appConfig.Database.DriverName == "pgx" {
		db, err := sql.Open("pgx", appConfig.Database.DatabaseURL)
		if err != nil {
			log.Fatal("opening ent client", zap.Error(err))
		}
		drv := entsql.OpenDB(dialect.Postgres, db)
		if config.AppConfig.Debug {
			client = ent.NewClient(ent.Driver(drv), ent.Debug())
		} else {
			client = ent.NewClient(ent.Driver(drv))
		}
	} else {
		log.Fatalf("Currently only support database drivers: sqlite3, pgx. Please recheck the database configuration!")
	}

	if err != nil {
		log.Fatalf("failed opening connection to %s: %v", appConfig.Database.DriverName, err)
	}
	ctx := context.Background()
	if err := client.Schema.Create(
		ctx,
		migrate.WithGlobalUniqueID(true),
		migrate.WithDropIndex(true),
		migrate.WithDropColumn(true),
	); err != nil {
		log.Fatalf("failed creating schema resources: %v", zap.Error(err))
	}

	// Add a global hook that runs on all types and all operations.
	client.Use(func(next ent.Mutator) ent.Mutator {
		return ent.MutateFunc(func(ctx context.Context, m ent.Mutation) (ent.Value, error) {
			start := time.Now()
			defer func() {
				log.Printf("Op=%s\tType=%s\tTime=%s\tConcreteType=%T\n", m.Op(), m.Type(), time.Since(start), m)
			}()
			return next.Mutate(ctx, m)
		})
	})

	// Run the auto migration tool.
	if err := client.Schema.Create(ctx); err != nil {
		log.Fatalf("failed creating schema resources: %v", err)
	}

	if totalUsers, err := user.Count(ctx, client); err == nil && totalUsers == 0 {
		InitData(ctx, client, appConfig)
	} else if err != nil {
		panic(err)
	}
	return client
}

// InitData create seed data
func InitData(ctx context.Context, client *ent.Client, appConfig *config.Option) {

	permissions := []model.Permission{model.PermissionUser, model.PermissionPermissionGroup, model.PermissionContentSetting, model.PermissionPost}

	createPermissionGroupIn := model.CreatePermissionGroupIn{
		Name:        appConfig.InitPermissionGroup.Name,
		Description: &appConfig.InitPermissionGroup.Description,
		Permissions: permissions,
	}
	permissionGroup, err := permissiongroup.Create(ctx, client, &createPermissionGroupIn)
	if err != nil {
		log.Fatal(err)
	}

	initUser := model.CreateUserIn{
		Email:              appConfig.InitUser.Email,
		Password:           appConfig.InitUser.Password,
		PermissionGroupIDs: []int{permissionGroup.ID},
	}
	if err := user.CreateInitUser(ctx, client, &initUser); err != nil {
		log.Fatal(err)
	}

}

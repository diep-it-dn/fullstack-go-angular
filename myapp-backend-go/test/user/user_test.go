package auth_test

import (
	"strings"
	"testing"
	"time"

	"github.com/99designs/gqlgen/client"
	"github.com/diep-it-dn/fullstack-go-angular/myapp-backend-go/internal/config"
	"github.com/diep-it-dn/fullstack-go-angular/myapp-backend-go/test/generated"
	"github.com/diep-it-dn/fullstack-go-angular/myapp-backend-go/test/model"
	"github.com/diep-it-dn/fullstack-go-angular/myapp-backend-go/test/testutil"
	_ "github.com/mattn/go-sqlite3"
	"github.com/stretchr/testify/suite"
)

type testSuite struct {
	testutil.Suite
}

func (s *testSuite) SetupTest() {
	s.Setup()
}

func TestUser(t *testing.T) {
	suite.Run(t, &testSuite{})
}

func (s *testSuite) TestCreateUserWithEmailAndPassword() {
	input := model.CreateUserIn{
		Email:    *testutil.RandomEmail(),
		Password: *testutil.RandomString(8),
	}

	var resp generated.CreateUser
	err := s.Post(generated.CreateUserDocument, &resp, client.Var(testutil.Input, input), s.AddHeaderAuthAdmin())
	s.Require().NoError(err)
	s.Assert().Equal(input.Email, resp.CreateUser.Email)
	s.Assert().Empty(resp.CreateUser.PermissionGroups)
	s.Assert().Equal(model.UserStatusEnabled, resp.CreateUser.Status)
	s.Assert().Empty(resp.CreateUser.FirstName)
	s.Assert().Empty(resp.CreateUser.LastName)
	s.Assert().Empty(resp.CreateUser.Birthday)
	s.Assert().Empty(resp.CreateUser.AvatarURL)
	s.Assert().Empty(resp.CreateUser.Gender)
	s.Assert().NotEmpty(resp.CreateUser.CreateTime)
	s.Assert().NotEmpty(resp.CreateUser.UpdateTime)
}

func (s *testSuite) TestCreateUserWithFullInfo() generated.CreateUser {
	newPermissionGroup, _ := s.CreatePermissionGroup(testutil.BuildCreatePermissionGroupIn())
	input := buildCreateUserIn([]string{newPermissionGroup.CreatePermissionGroup.ID})
	resp := createUser(s, input)

	s.Assert().Equal(input.Email, resp.CreateUser.Email)
	s.Assert().Equal(1, len(resp.CreateUser.PermissionGroups))
	s.Assert().Equal(newPermissionGroup.CreatePermissionGroup.ID, resp.CreateUser.PermissionGroups[0].ID)
	s.Assert().Equal(newPermissionGroup.CreatePermissionGroup.Name, resp.CreateUser.PermissionGroups[0].Name)
	s.Assert().Equal(newPermissionGroup.CreatePermissionGroup.Description, resp.CreateUser.PermissionGroups[0].Description)
	s.Assert().Equal(model.UserStatusEnabled, resp.CreateUser.Status)
	s.Assert().Equal(*input.FirstName, *resp.CreateUser.FirstName)
	s.Assert().Equal(*input.LastName, *resp.CreateUser.LastName)
	s.Assert().Equal(*input.Birthday, *resp.CreateUser.Birthday)
	s.Assert().Equal(*input.AvatarURL, *resp.CreateUser.AvatarURL)
	s.Assert().Equal(input.Gender.String(), resp.CreateUser.Gender.String())
	s.Assert().NotEmpty(resp.CreateUser.CreateTime)
	s.Assert().NotEmpty(resp.CreateUser.UpdateTime)

	return resp
}

func createUser(s *testSuite, input model.CreateUserIn) generated.CreateUser {
	var resp generated.CreateUser
	err := s.Post(generated.CreateUserDocument, &resp, client.Var(testutil.Input, input), s.AddHeaderAuthAdmin())
	s.Require().NoError(err)
	return resp
}

func buildCreateUserIn(permissionGroupIDs []string) model.CreateUserIn {
	gender := model.UserGenderMale

	input := model.CreateUserIn{
		Email:              *testutil.RandomEmail(),
		Password:           *testutil.RandomString(10),
		PermissionGroupIDs: permissionGroupIDs,
		FirstName:          testutil.RandomString(10),
		LastName:           testutil.RandomString(10),
		Birthday:           testutil.RamdomDateStringInPass(),
		AvatarURL:          testutil.RandomURL(),
		Gender:             &gender,
	}
	return input
}

func (s *testSuite) TestUpdateUser() {
	newPermissionGroup, _ := s.CreatePermissionGroup(testutil.BuildCreatePermissionGroupIn())
	createUserIn := buildCreateUserIn([]string{newPermissionGroup.CreatePermissionGroup.ID})
	newUser := createUser(s, createUserIn)

	input := model.UpdateUserIn{
		EmailIn: &model.UpdateRequiredStringIn{
			IsUpdate: true,
			Value:    *testutil.RandomEmail(),
		},
		PasswordIn: &model.UpdateRequiredStringIn{
			IsUpdate: true,
			Value:    *testutil.RandomString(15),
		},
	}

	var resp generated.UpdateUser
	err := s.Post(generated.UpdateUserDocument, &resp, client.Var(testutil.ID, newUser.CreateUser.ID), client.Var(testutil.Input, &input), s.AddHeaderAuthAdmin())
	s.Require().NoError(err)

	s.Assert().Equal(newUser.CreateUser.ID, resp.UpdateUser.ID)
	s.Assert().Equal(input.EmailIn.Value, resp.UpdateUser.Email)
	s.Assert().Equal(1, len(resp.UpdateUser.PermissionGroups))

	verifyLogin(s, input.EmailIn.Value, input.PasswordIn.Value)

	s.Assert().Equal(newPermissionGroup.CreatePermissionGroup.ID, resp.UpdateUser.PermissionGroups[0].ID)
	s.Assert().Equal(newPermissionGroup.CreatePermissionGroup.Name, resp.UpdateUser.PermissionGroups[0].Name)
	s.Assert().Equal(newPermissionGroup.CreatePermissionGroup.Description, resp.UpdateUser.PermissionGroups[0].Description)
	s.Assert().Equal(model.UserStatusEnabled, resp.UpdateUser.Status)
	s.Assert().Equal(*newUser.CreateUser.FirstName, *resp.UpdateUser.FirstName)
	s.Assert().Equal(*newUser.CreateUser.LastName, *resp.UpdateUser.LastName)
	s.Assert().Equal(*newUser.CreateUser.Birthday, *resp.UpdateUser.Birthday)
	s.Assert().Equal(*newUser.CreateUser.AvatarURL, *resp.UpdateUser.AvatarURL)
	s.Assert().Equal(newUser.CreateUser.Gender.String(), resp.UpdateUser.Gender.String())
	s.Assert().NotEmpty(resp.UpdateUser.CreateTime)
	s.Assert().NotEmpty(resp.UpdateUser.UpdateTime)

	// continue to test update other fields
	newPermissionGroup, _ = s.CreatePermissionGroup(testutil.BuildCreatePermissionGroupIn())
	input.EmailIn.IsUpdate = false
	input.PermissionGroupIDsIn = &model.UpdateIDsIn{IsUpdate: true, Value: []string{newPermissionGroup.CreatePermissionGroup.ID}}
	input.FirstNameIn = &model.UpdateStringIn{IsUpdate: true, Value: testutil.RandomString(10)}
	input.LastNameIn = &model.UpdateStringIn{IsUpdate: true, Value: testutil.RandomString(10)}
	birthday := time.Now().Add(time.Hour * 24 * 365 * 25).Format(time.RFC3339)
	input.BirthdayIn = &model.UpdateTimeIn{IsUpdate: true, Value: &birthday}
	input.AvatarURLIn = &model.UpdateStringIn{IsUpdate: true, Value: testutil.RandomURL()}
	gender := model.UserGenderFemale
	input.GenderIn = &model.UpdateUserGenderIn{IsUpdate: true, Value: &gender}

	err = s.Post(generated.UpdateUserDocument, &resp, client.Var(testutil.ID, newUser.CreateUser.ID), client.Var(testutil.Input, &input), s.AddHeaderAuthAdmin())
	s.Require().NoError(err)

	s.Assert().Equal(newUser.CreateUser.ID, resp.UpdateUser.ID)
	s.Assert().Equal(input.EmailIn.Value, resp.UpdateUser.Email)
	s.Assert().Equal(1, len(resp.UpdateUser.PermissionGroups))

	verifyLogin(s, input.EmailIn.Value, input.PasswordIn.Value)

	s.Assert().Equal(newPermissionGroup.CreatePermissionGroup.ID, resp.UpdateUser.PermissionGroups[0].ID)
	s.Assert().Equal(newPermissionGroup.CreatePermissionGroup.Name, resp.UpdateUser.PermissionGroups[0].Name)
	s.Assert().Equal(newPermissionGroup.CreatePermissionGroup.Description, resp.UpdateUser.PermissionGroups[0].Description)
	s.Assert().Equal(model.UserStatusEnabled, resp.UpdateUser.Status)
	s.Assert().Equal(*input.FirstNameIn.Value, *resp.UpdateUser.FirstName)
	s.Assert().Equal(*input.LastNameIn.Value, *resp.UpdateUser.LastName)
	s.Assert().Equal(*input.BirthdayIn.Value, *resp.UpdateUser.Birthday)
	s.Assert().Equal(*input.AvatarURLIn.Value, *resp.UpdateUser.AvatarURL)
	s.Assert().Equal(input.GenderIn.Value.String(), resp.UpdateUser.Gender.String())
	s.Assert().NotEmpty(resp.UpdateUser.CreateTime)
	s.Assert().NotEmpty(resp.UpdateUser.UpdateTime)

	// continue to test update status to disabled, then user can not login
	input.StatusIn = &model.UserStatusIn{IsUpdate: true, Value: model.UserStatusDisabled}
	err = s.Post(generated.UpdateUserDocument, &resp, client.Var(testutil.ID, newUser.CreateUser.ID), client.Var(testutil.Input, &input), s.AddHeaderAuthAdmin())
	s.Require().NoError(err)
	_, err = s.Login(input.EmailIn.Value, input.PasswordIn.Value)
	s.Require().EqualError(err, "[{\"message\":\"User is disabled\",\"path\":[\"login\"]}]")
}

func (s *testSuite) TestLogin() {
	verifyLogin(s, config.AppConfig.InitUser.Email, config.AppConfig.InitUser.Password)
}

func verifyLogin(s *testSuite, email, password string) {
	input := model.LoginIn{
		Email:    email,
		Password: password,
	}
	resp, err := s.Login(input.Email, input.Password)
	s.Require().NoError(err)
	s.Assert().NotEmpty(resp.Login.User.ID)
	s.Require().Equal(email, resp.Login.User.Email)
	s.Assert().NotEmpty(resp.Login.TokenPair.Token)
	s.Assert().NotEmpty(resp.Login.TokenPair.RefreshToken)
}

func (s *testSuite) TestGetCurrentUser() {
	newPermissionGroup, _ := s.CreatePermissionGroup(testutil.BuildCreatePermissionGroupIn())
	createUserIn := buildCreateUserIn([]string{newPermissionGroup.CreatePermissionGroup.ID})
	newUser := createUser(s, createUserIn)

	login, _ := s.Login(createUserIn.Email, createUserIn.Password)
	var resp generated.CurrentUser
	err := s.Post(generated.CurrentUserDocument, &resp, client.AddHeader(testutil.Authorization, testutil.BearPrefix+login.Login.TokenPair.Token))
	s.Require().NoError(err)
	s.Assert().Equal(newUser.CreateUser.ID, resp.CurrentUser.ID)
	s.Assert().Equal(newUser.CreateUser.Email, resp.CurrentUser.Email)

	s.Assert().Equal(1, len(resp.CurrentUser.PermissionGroups))
	s.Assert().Equal(newPermissionGroup.CreatePermissionGroup.ID, resp.CurrentUser.PermissionGroups[0].ID)
	s.Assert().Equal(newPermissionGroup.CreatePermissionGroup.Name, resp.CurrentUser.PermissionGroups[0].Name)
	s.Assert().Equal(newPermissionGroup.CreatePermissionGroup.Description, resp.CurrentUser.PermissionGroups[0].Description)
	s.Assert().Equal(newUser.CreateUser.Status.String(), resp.CurrentUser.Status.String())
	s.Assert().Equal(*newUser.CreateUser.FirstName, *resp.CurrentUser.FirstName)
	s.Assert().Equal(*newUser.CreateUser.LastName, *resp.CurrentUser.LastName)
	s.Assert().Equal(*newUser.CreateUser.Birthday, *resp.CurrentUser.Birthday)
	s.Assert().Equal(*newUser.CreateUser.AvatarURL, *resp.CurrentUser.AvatarURL)
	s.Assert().Equal(newUser.CreateUser.Gender.String(), resp.CurrentUser.Gender.String())
	s.Assert().NotEmpty(resp.CurrentUser.CreateTime)
	s.Assert().NotEmpty(resp.CurrentUser.UpdateTime)
}

func (s *testSuite) TestGetUserById() {
	newPermissionGroup, _ := s.CreatePermissionGroup(testutil.BuildCreatePermissionGroupIn())
	createUserIn := buildCreateUserIn([]string{newPermissionGroup.CreatePermissionGroup.ID})
	newUser := createUser(s, createUserIn)

	var resp generated.UserByID
	err := s.Post(generated.UserByIDDocument, &resp, client.Var(testutil.ID, newUser.CreateUser.ID), s.AddHeaderAuthAdmin())
	s.Require().NoError(err)
	s.Assert().Equal(newUser.CreateUser.ID, resp.User.ID)
	s.Assert().Equal(newUser.CreateUser.Email, resp.User.Email)

	s.Assert().Equal(1, len(resp.User.PermissionGroups))
	s.Assert().Equal(newPermissionGroup.CreatePermissionGroup.ID, resp.User.PermissionGroups[0].ID)
	s.Assert().Equal(newPermissionGroup.CreatePermissionGroup.Name, resp.User.PermissionGroups[0].Name)
	s.Assert().Equal(newPermissionGroup.CreatePermissionGroup.Description, resp.User.PermissionGroups[0].Description)
	s.Assert().Equal(newUser.CreateUser.Status.String(), resp.User.Status.String())
	s.Assert().Equal(*newUser.CreateUser.FirstName, *resp.User.FirstName)
	s.Assert().Equal(*newUser.CreateUser.LastName, *resp.User.LastName)
	s.Assert().Equal(*newUser.CreateUser.Birthday, *resp.User.Birthday)
	s.Assert().Equal(*newUser.CreateUser.AvatarURL, *resp.User.AvatarURL)
	s.Assert().Equal(newUser.CreateUser.Gender.String(), resp.User.Gender.String())
	s.Assert().NotEmpty(resp.User.CreateTime)
	s.Assert().NotEmpty(resp.User.UpdateTime)
}

func (s *testSuite) TestGetUsers() {
	var resp generated.Users
	err := s.Post(generated.UsersDocument, &resp, s.AddHeaderAuthAdmin())
	s.Require().NoError(err)
	s.Assert().NotNil(resp.Users.PageInfo.HasNextPage)
	s.Assert().NotNil(resp.Users.PageInfo.HasPreviousPage)
	s.Assert().NotNil(resp.Users.PageInfo.StartCursor)
	s.Assert().NotNil(resp.Users.PageInfo.EndCursor)
	s.Assert().True(resp.Users.TotalCount > 0)
	s.Assert().True(len(resp.Users.Edges) > 0)
}

func (s *testSuite) TestGetUsersWithConditions() {
	var resp generated.Users

	emailNamePart := strings.Split(config.AppConfig.InitUser.Email, "@")[0]
	input := model.UsersIn{
		Email: &emailNamePart,
	}
	err := s.Post(generated.UsersDocument, &resp, client.Var(testutil.Input, &input), s.AddHeaderAuthAdmin())
	s.Require().NoError(err)
	s.Assert().NotNil(resp.Users.PageInfo.HasNextPage)
	s.Assert().NotNil(resp.Users.PageInfo.HasPreviousPage)
	s.Assert().NotNil(resp.Users.PageInfo.StartCursor)
	s.Assert().NotNil(resp.Users.PageInfo.EndCursor)
	s.Assert().Equal(1, resp.Users.TotalCount)
	s.Assert().Equal(1, len(resp.Users.Edges))
	s.Assert().Equal(config.AppConfig.InitUser.Email, resp.Users.Edges[0].Node.Email)
}

func (s *testSuite) TestChangePasswordError() {
	input := model.ChangePasswordIn{
		CurrentPassword: *testutil.RandomString(10),
		NewPassword:     *testutil.RandomString(12),
	}
	var resp generated.ChangePassword
	err := s.Post(generated.ChangePasswordDocument, &resp, client.Var(testutil.Input, &input), s.AddHeaderAuthAdmin())
	s.Require().Error(err)
	s.Assert().False(resp.ChangePassword)
	verifyLogin(s, config.AppConfig.InitUser.Email, config.AppConfig.InitUser.Password)
}

func (s *testSuite) TestChangePassword() {
	input := model.ChangePasswordIn{
		CurrentPassword: config.AppConfig.InitUser.Password,
		NewPassword:     *testutil.RandomString(12),
	}
	var resp generated.ChangePassword
	err := s.Post(generated.ChangePasswordDocument, &resp, client.Var(testutil.Input, &input), s.AddHeaderAuthAdmin())
	s.Require().NoError(err)
	s.Assert().True(resp.ChangePassword)
	verifyLogin(s, config.AppConfig.InitUser.Email, input.NewPassword)
}

// If using gmail -> Turn off "Less secure app access" at here https://myaccount.google.com/lesssecureapps
// func (s *testSuite) TestForgotPassword() {
// 	var resp model.ForgotPassword
// 	email := config.AppConfig.InitUser.Email
// 	err := s.Post(model.ForgotPasswordDocument, &resp, client.Var("email", &email), s.AddHeaderAuthAdmin())
// 	s.Require().NoError(err)
// 	s.Assert().True(resp.ForgotPassword)
// 	verifyLogin(s, config.AppConfig.InitUser.Email, config.AppConfig.InitUser.Password)
// }

func (s *testSuite) TestDeleteUser() {
	newPermissionGroup, _ := s.CreatePermissionGroup(testutil.BuildCreatePermissionGroupIn())
	input := buildCreateUserIn([]string{newPermissionGroup.CreatePermissionGroup.ID})
	newUser := createUser(s, input)

	var resp generated.DeleteUser
	err := s.Post(generated.DeleteUserDocument, &resp, client.Var(testutil.ID, newUser.CreateUser.ID), s.AddHeaderAuthAdmin())
	s.Require().NoError(err)
	s.Assert().True(resp.DeleteUser)
}

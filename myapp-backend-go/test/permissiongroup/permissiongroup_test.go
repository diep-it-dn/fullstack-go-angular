package permissiongroup_test

import (
	"testing"

	"github.com/99designs/gqlgen/client"
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

func TestPermissionGroup(t *testing.T) {
	suite.Run(t, &testSuite{})
}

func (s *testSuite) TestQueryPermissionAll() {
	var resp generated.PermissionAll
	err := s.Post(generated.PermissionAllDocument, &resp, s.AddHeaderAuthAdmin())
	s.Require().NoError(err)
	verifyPermissions(s, model.AllPermission, resp.PermissionAll)
}

func (s *testSuite) TestCreatePermissionGroupError() {
	_, err := s.CreatePermissionGroup(&model.CreatePermissionGroupIn{})
	s.Require().Error(err)
}

func (s *testSuite) TestCreatePermissionGroupWithName() generated.CreatePermissionGroup {
	input := &model.CreatePermissionGroupIn{
		Name: *testutil.RandomString(10),
	}

	resp, err := s.CreatePermissionGroup(input)

	s.Require().NoError(err)
	s.Assert().Equal(input.Name, resp.CreatePermissionGroup.Name)
	s.Assert().Nil(resp.CreatePermissionGroup.Description)
	s.Assert().Empty(resp.CreatePermissionGroup.Permissions)

	return resp
}

func (s *testSuite) TestCreatePermissionGroupWithFullInfo() {
	input := testutil.BuildCreatePermissionGroupIn()
	resp, err := s.CreatePermissionGroup(input)

	s.Require().NoError(err)
	s.Assert().Equal(input.Name, resp.CreatePermissionGroup.Name)
	s.Assert().Equal(*input.Description, *resp.CreatePermissionGroup.Description)
	verifyPermissions(s, input.Permissions, resp.CreatePermissionGroup.Permissions)
}

func (s *testSuite) TestUpdatePermissionGroup() {
	newPg, _ := s.CreatePermissionGroup(testutil.BuildCreatePermissionGroupIn())
	input := model.UpdatePermissionGroupIn{
		NameIn: &model.UpdateRequiredStringIn{
			IsUpdate: true,
			Value:    *testutil.RandomString(15),
		},
		DescriptionIn: &model.UpdateStringIn{
			IsUpdate: true,
			Value:    testutil.RandomString(20),
		},
	}

	var resp generated.UpdatePermissionGroup
	err := s.Post(generated.UpdatePermissionGroupDocument, &resp, client.Var(testutil.ID, newPg.CreatePermissionGroup.ID), client.Var(testutil.Input, &input), s.AddHeaderAuthAdmin())

	s.Require().NoError(err)
	s.Assert().Equal(input.NameIn.Value, resp.UpdatePermissionGroup.Name)
	s.Assert().Equal(*input.DescriptionIn.Value, *resp.UpdatePermissionGroup.Description)
	verifyPermissions(s, newPg.CreatePermissionGroup.Permissions, resp.UpdatePermissionGroup.Permissions)

	// continue to test update: unchange name, set permissions to new value and set description to nil
	input.PermissionsIn = &model.UpdatePermissionsIn{
		IsUpdate: true,
		Value:    []model.Permission{model.PermissionUserU, model.PermissionPermissionGroupD},
	}
	input.DescriptionIn = &model.UpdateStringIn{
		IsUpdate: true,
		Value:    nil,
	}

	err = s.Post(generated.UpdatePermissionGroupDocument, &resp, client.Var(testutil.ID, newPg.CreatePermissionGroup.ID), client.Var(testutil.Input, &input), s.AddHeaderAuthAdmin())

	s.Require().NoError(err)
	s.Assert().Equal(input.NameIn.Value, resp.UpdatePermissionGroup.Name)
	s.Assert().Nil(resp.UpdatePermissionGroup.Description)

	verifyPermissions(s, input.PermissionsIn.Value, resp.UpdatePermissionGroup.Permissions)
}

func (s *testSuite) TestDeletePermissionGroup() {
	newPg := s.TestCreatePermissionGroupWithName()
	var resp generated.DeletePermissionGroup
	err := s.Post(generated.DeletePermissionGroupDocument, &resp, client.Var(testutil.ID, newPg.CreatePermissionGroup.ID), s.AddHeaderAuthAdmin())
	s.Require().NoError(err)
	s.Assert().True(resp.DeletePermissionGroup)
}

func verifyPermissions(s *testSuite, expected []model.Permission, actual []model.Permission) {
	s.Assert().Equal(len(expected), len(actual))
	for _, v := range expected {
		if !contains(actual, v) {
			panic("the permission " + v.String() + " is not contained in the response")
		}
	}
}

func contains(s []model.Permission, p model.Permission) bool {
	for _, v := range s {
		if v == p {
			return true
		}
	}

	return false
}

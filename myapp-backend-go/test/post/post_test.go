package post_test

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

type Tags []*struct {
	ID   string "json:\"id\" graphql:\"id\""
	Name string "json:\"name\" graphql:\"name\""
}

func (s *testSuite) SetupTest() {
	s.Setup()
}

func TestPost(t *testing.T) {
	suite.Run(t, &testSuite{})
}

func (s *testSuite) TestCreatePostWithoutTags() {
	input := buildCreatePostIn()
	resp, err := createPost(s, input)
	verifyCreatedPost(s, err, input, resp)
}

func (s *testSuite) TestCreatePostWithTags() {
	input := buildCreatePostIn()
	input.Tags = []string{"tag1", "tag2"}
	resp, err := createPost(s, input)
	verifyCreatedPost(s, err, input, resp)

	input = buildCreatePostIn()
	input.Tags = []string{"tag2", "tag3", "tag4"}
	resp, err = createPost(s, input)
	verifyCreatedPost(s, err, input, resp)
}

func (s *testSuite) TestUpdatePost() {
	createPostIn := buildCreatePostIn()
	createPostIn.Tags = []string{"tag1", "tag2"}
	newPost, err := createPost(s, createPostIn)

	input := model.UpdatePostIn{
		TitleIn: &model.UpdateRequiredStringIn{
			IsUpdate: true,
			Value:    *testutil.RandomString(20),
		},
		StatusIn: &model.PostStatusIn{IsUpdate: true, Value: model.PostStatusApproved},
	}

	var resp generated.UpdatePost
	err = s.Post(generated.UpdatePostDocument, &resp, client.Var(testutil.ID, newPost.CreatePost.ID), client.Var(testutil.Input, input), s.AddHeaderAuthAdmin())
	verifyUpdatedPost(s, err, input, resp, newPost, createPostIn)
}

func (s *testSuite) TestDeletePost() {
	createPostIn := buildCreatePostIn()
	createPostIn.Tags = []string{"tag1", "tag2"}
	newPost, err := createPost(s, createPostIn)

	var resp generated.DeletePost
	err = s.Post(generated.DeletePostDocument, &resp, client.Var(testutil.ID, newPost.CreatePost.ID), s.AddHeaderAuthAdmin())
	s.Require().NoError(err)
	s.Assert().True(resp.DeletePost)
}

func verifyCreatedPost(s *testSuite, err error, input model.CreatePostIn, resp generated.CreatePost) {
	s.Require().NoError(err)
	s.Assert().Equal(input.Title, resp.CreatePost.Title)
	s.Assert().Equal(input.ShortDescription, resp.CreatePost.ShortDescription)
	s.Assert().Equal(input.Content, resp.CreatePost.Content)
	s.Assert().Equal(model.PostStatusDraft, resp.CreatePost.Status)
	verifyTags(s, input.Tags, resp.CreatePost.Tags)
	s.Assert().Equal(testutil.InitUser.Login.User.ID, resp.CreatePost.CreatedBy.ID)
	s.Assert().Equal(testutil.InitUser.Login.User.ID, resp.CreatePost.UpdatedBy.ID)
	s.Assert().NotEmpty(resp.CreatePost.CreateTime)
	s.Assert().NotEmpty(resp.CreatePost.UpdateTime)
}

func verifyUpdatedPost(s *testSuite, err error, input model.UpdatePostIn, resp generated.UpdatePost, newPost generated.CreatePost, createPostIn model.CreatePostIn) {
	s.Require().NoError(err)
	s.Assert().Equal(input.TitleIn.Value, resp.UpdatePost.Title)
	s.Assert().Equal(newPost.CreatePost.ShortDescription, resp.UpdatePost.ShortDescription)
	s.Assert().Equal(newPost.CreatePost.Content, resp.UpdatePost.Content)
	verifyTags(s, createPostIn.Tags, resp.UpdatePost.Tags)
	s.Assert().Equal(input.StatusIn.Value, resp.UpdatePost.Status)
	s.Assert().Equal(testutil.InitUser.Login.User.ID, resp.UpdatePost.CreatedBy.ID)
	s.Assert().Equal(testutil.InitUser.Login.User.ID, resp.UpdatePost.UpdatedBy.ID)
	s.Assert().NotEmpty(resp.UpdatePost.CreateTime)
	s.Assert().NotEmpty(resp.UpdatePost.UpdateTime)
}

func createPost(s *testSuite, input model.CreatePostIn) (generated.CreatePost, error) {
	var resp generated.CreatePost
	err := s.Post(generated.CreatePostDocument, &resp, client.Var(testutil.Input, input), s.AddHeaderAuthAdmin())
	return resp, err
}

func buildCreatePostIn() model.CreatePostIn {
	input := model.CreatePostIn{
		Title:            *testutil.RandomString(20),
		ShortDescription: *testutil.RandomString(30),
		Content:          *testutil.RandomString(100),
	}
	return input
}

func verifyTags(s *testSuite, expected []string, actual Tags) {
	s.Assert().Equal(len(expected), len(actual))
	for _, tag := range expected {
		if !contains(actual, tag) {
			panic("the tag " + tag + " is not contained in the response")
		}
	}
}

func contains(s Tags, tag string) bool {
	for _, v := range s {
		if v.Name == tag {
			return true
		}
	}

	return false
}

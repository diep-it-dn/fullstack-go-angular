package resolver

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.

import (
	"context"

	"github.com/diep-it-dn/fullstack-go-angular/myapp-backend-go/ent"
	"github.com/diep-it-dn/fullstack-go-angular/myapp-backend-go/graph/model"
	"github.com/diep-it-dn/fullstack-go-angular/myapp-backend-go/internal/auth"
	"github.com/diep-it-dn/fullstack-go-angular/myapp-backend-go/internal/user"
	"github.com/diep-it-dn/fullstack-go-angular/myapp-backend-go/pkg/jwt"
)

func (r *mutationResolver) CreateUser(ctx context.Context, input model.CreateUserIn) (*ent.User, error) {
	return user.Create(ctx, ent.FromContext(ctx), &input)
}

func (r *mutationResolver) UpdateUser(ctx context.Context, id int, input model.UpdateUserIn) (*ent.User, error) {
	return user.Update(ctx, ent.FromContext(ctx), id, &input)
}

func (r *mutationResolver) DeleteUser(ctx context.Context, id int) (bool, error) {
	err := user.Delete(ctx, ent.FromContext(ctx), id)
	return err == nil, err
}

func (r *mutationResolver) UpdateCurrentUser(ctx context.Context, input model.UpdateCurrentUserIn) (*ent.User, error) {
	return user.UpdateCurrentUser(ctx, ent.FromContext(ctx), auth.ForContext(ctx).ID, &input)
}

func (r *mutationResolver) RegisterUser(ctx context.Context, input model.RegisterUserIn) (*model.RegisterUserOut, error) {
	currentUser, err := user.RegisterUser(ctx, ent.FromContext(ctx), &input)
	if err != nil {
		return nil, err
	}
	tokenPair, err := jwt.GenerateTokenPair(currentUser.Email)
	if err != nil {
		return nil, err
	}

	return &model.RegisterUserOut{
		TokenPair: tokenPair,
		User:      currentUser,
	}, nil
}

func (r *mutationResolver) Login(ctx context.Context, input model.LoginIn) (*model.LoginOut, error) {
	currentUser, correct := user.Authenticate(ctx, ent.FromContext(ctx), &input)
	if !correct {
		return nil, &user.WrongEmailOrPasswordError{}
	}
	err := user.CheckValidStatus(currentUser)
	if err != nil {
		return nil, err
	}

	tokenPair, err := jwt.GenerateTokenPair(currentUser.Email)
	if err != nil {
		return nil, err
	}

	return &model.LoginOut{
		TokenPair: tokenPair,
		User:      currentUser,
	}, nil
}

func (r *mutationResolver) ChangePassword(ctx context.Context, input model.ChangePasswordIn) (bool, error) {
	err := user.ChangePassword(ctx, ent.FromContext(ctx), auth.ForContext(ctx).ID, &input)
	return err == nil, err
}

func (r *mutationResolver) ForgotPassword(ctx context.Context, email string) (bool, error) {
	err := user.ForgotPassword(ctx, ent.FromContext(ctx), &email)
	return err == nil, err
}

func (r *mutationResolver) ResetPassword(ctx context.Context, input model.ResetPasswordIn) (bool, error) {
	err := user.ResetPassword(ctx, ent.FromContext(ctx), &input)
	return err == nil, err
}

func (r *mutationResolver) RefreshToken(ctx context.Context, refreshTokenIn string) (*model.TokenPair, error) {
	return jwt.RefreshToken(refreshTokenIn)
}

func (r *mutationResolver) LoginByGoogle(ctx context.Context, input model.LoginByGoogleIn) (*model.LoginOut, error) {
	currentUser, err := user.AuthenticateByGoogle(ctx, ent.FromContext(ctx), &input)
	tokenPair, err := jwt.GenerateTokenPair(currentUser.Email)
	if err != nil {
		return nil, err
	}

	return &model.LoginOut{
		TokenPair: tokenPair,
		User:      currentUser,
	}, nil
}

func (r *queryResolver) CurrentUser(ctx context.Context) (*ent.User, error) {
	return auth.ForContext(ctx), nil
}

func (r *queryResolver) User(ctx context.Context, id int) (*ent.User, error) {
	res, err := r.client.User.Get(ctx, id)
	return res, err
}

func (r *queryResolver) Users(ctx context.Context, input *model.UsersIn) (*ent.UserConnection, error) {
	return user.Users(ctx, r.client, input)
}

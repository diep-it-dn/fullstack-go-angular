package resolver

import (
	"context"

	"github.com/99designs/gqlgen/graphql"
	"github.com/diep-it-dn/fullstack-go-angular/myapp-backend-go/ent"
	"github.com/diep-it-dn/fullstack-go-angular/myapp-backend-go/graph/generated"
	"github.com/diep-it-dn/fullstack-go-angular/myapp-backend-go/graph/model"
	"github.com/diep-it-dn/fullstack-go-angular/myapp-backend-go/internal/auth"
	"github.com/diep-it-dn/fullstack-go-angular/myapp-backend-go/internal/user"
	"github.com/diep-it-dn/fullstack-go-angular/myapp-backend-go/internal/validator"
)

// This file will not be regenerated automatically.
//
// It serves as dependency injection for your app, add any dependencies you require here.

// Resolver resolver struct type
type Resolver struct{ client *ent.Client }

// NewSchema creates a graphql executable schema.
func NewSchema(client *ent.Client) graphql.ExecutableSchema {
	config := generated.Config{
		Resolvers: &Resolver{client},
	}

	config.Directives.IsLoggedIn = func(ctx context.Context, obj interface{}, next graphql.Resolver) (interface{}, error) {
		user := auth.ForContext(ctx)
		if user == nil {

			return nil, &auth.AccessDenied{}
		}
		// or let it pass through
		return next(ctx)
	}

	config.Directives.HasAnyPermission = func(ctx context.Context, obj interface{}, next graphql.Resolver, permissions []model.Permission) (interface{}, error) {
		currentUser := auth.ForContext(ctx)
		if currentUser == nil || !user.HasAnyPermission(currentUser, permissions) {
			return nil, &auth.AccessDenied{}
		}
		// or let it pass through
		return next(ctx)
	}

	config.Directives.IsValidEmail = func(ctx context.Context, obj interface{}, next graphql.Resolver, field string) (res interface{}, err error) {
		var asMap = obj.(map[string]interface{})

		err = validateRequiredField(asMap, field, validator.ValidateEmail)
		if err != nil {
			return nil, err
		}

		return next(ctx)
	}

	config.Directives.IsNotExistsEmail = func(ctx context.Context, obj interface{}, next graphql.Resolver, field string) (res interface{}, err error) {
		var asMap = obj.(map[string]interface{})

		for k, v := range asMap {
			switch k {
			case field:
				id, err := user.GetUserIDByEmail(ent.FromContext(ctx), v.(string))
				if err != nil {
					return nil, err
				}
				if id > 0 {
					return nil, &user.EmailExists{}
				}
			}
		}
		return next(ctx)
	}

	config.Directives.IsValidPassword = func(ctx context.Context, obj interface{}, next graphql.Resolver, field string) (res interface{}, err error) {
		var asMap = obj.(map[string]interface{})

		err = validateRequiredField(asMap, field, validator.ValidatePassword)
		if err != nil {
			return nil, err
		}

		return next(ctx)
	}

	return generated.NewExecutableSchema(config)
}

func validateRequiredField(asMap map[string]interface{}, field string, fn func(v string) error) error {
	for k, v := range asMap {
		switch k {
		case field:
			switch v.(type) {
			case string:
				err := fn(v.(string))
				if err != nil {
					return err
				}
			case map[string]interface{}:
				it := unmarshalInputUpdateRequiredStringIn(v)

				if it.IsUpdate {
					err := fn(it.Value)
					if err != nil {
						return err
					}
				}
			}
		}
	}

	return nil
}

func unmarshalInputUpdateRequiredStringIn(v interface{}) model.UpdateRequiredStringIn {
	var it model.UpdateRequiredStringIn
	var asMap = v.(map[string]interface{})

	for k, v := range asMap {
		switch k {
		case "isUpdate":
			it.IsUpdate = v.(bool)
		case "value":
			it.Value = v.(string)
		}
	}
	return it
}

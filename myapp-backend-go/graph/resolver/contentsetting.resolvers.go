package resolver

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.

import (
	"context"

	"github.com/diep-it-dn/fullstack-go-angular/myapp-backend-go/ent"
	"github.com/diep-it-dn/fullstack-go-angular/myapp-backend-go/graph/generated"
	"github.com/diep-it-dn/fullstack-go-angular/myapp-backend-go/graph/model"
	"github.com/diep-it-dn/fullstack-go-angular/myapp-backend-go/internal/contentsetting"
)

func (r *mutationResolver) SetContentSetting(ctx context.Context, input model.SetContentSettingIn) (*ent.ContentSetting, error) {
	return contentsetting.Set(ctx, ent.FromContext(ctx), &input)
}

func (r *mutationResolver) DeleteContentSetting(ctx context.Context, id int) (bool, error) {
	err := contentsetting.Delete(ctx, ent.FromContext(ctx), &id)
	return err == nil, err
}

func (r *queryResolver) ContentSetting(ctx context.Context, name string) (*ent.ContentSetting, error) {
	return contentsetting.ContentSetting(ctx, r.client, name)
}

func (r *queryResolver) ContentSettings(ctx context.Context) ([]*ent.ContentSetting, error) {
	return contentsetting.ContentSettings(ctx, r.client)
}

// Mutation returns generated.MutationResolver implementation.
func (r *Resolver) Mutation() generated.MutationResolver { return &mutationResolver{r} }

type mutationResolver struct{ *Resolver }

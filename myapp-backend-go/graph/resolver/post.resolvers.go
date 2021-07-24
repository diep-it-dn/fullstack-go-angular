package resolver

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.

import (
	"context"

	"github.com/diep-it-dn/fullstack-go-angular/myapp-backend-go/ent"
	"github.com/diep-it-dn/fullstack-go-angular/myapp-backend-go/graph/model"
	"github.com/diep-it-dn/fullstack-go-angular/myapp-backend-go/internal/post"
)

func (r *mutationResolver) CreatePost(ctx context.Context, input model.CreatePostIn) (*ent.Post, error) {
	return post.Create(ctx, ent.FromContext(ctx), &input)
}

func (r *mutationResolver) UpdatePost(ctx context.Context, id int, input model.UpdatePostIn) (*ent.Post, error) {
	return post.Update(ctx, ent.FromContext(ctx), id, &input)
}

func (r *mutationResolver) DeletePost(ctx context.Context, id int) (bool, error) {
	err := post.Delete(ctx, ent.FromContext(ctx), &id)
	return err == nil, err
}

func (r *queryResolver) PostByID(ctx context.Context, id int) (*ent.Post, error) {
	return post.ByID(ctx, r.client, id)
}

func (r *queryResolver) Posts(ctx context.Context, input *model.PostsIn) (*ent.PostConnection, error) {
	return post.Posts(ctx, r.client, input)
}

func (r *queryResolver) PublishedPosts(ctx context.Context, input *model.PublishedPostsIn) (*ent.PostConnection, error) {
	return post.PublishedPosts(ctx, r.client, input)
}

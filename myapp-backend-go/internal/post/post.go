package post

import (
	"context"
	"fmt"
	"log"
	"strings"

	"github.com/diep-it-dn/fullstack-go-angular/myapp-backend-go/ent"
	"github.com/diep-it-dn/fullstack-go-angular/myapp-backend-go/ent/post"
	"github.com/diep-it-dn/fullstack-go-angular/myapp-backend-go/ent/predicate"
	"github.com/diep-it-dn/fullstack-go-angular/myapp-backend-go/ent/tag"
	"github.com/diep-it-dn/fullstack-go-angular/myapp-backend-go/graph/model"
	"github.com/diep-it-dn/fullstack-go-angular/myapp-backend-go/internal/auth"
	"github.com/diep-it-dn/fullstack-go-angular/myapp-backend-go/internal/user"
)

// Create new Post
func Create(ctx context.Context, client *ent.Client, input *model.CreatePostIn) (*ent.Post, error) {
	createdBy := auth.ForContext(ctx)

	tagIDs, err := getTagIDs(ctx, client, input.Tags)
	if err != nil {
		return nil, err
	}

	post, err := client.Post.Create().
		SetTitle(input.Title).
		SetShortDescription(input.ShortDescription).
		SetContent(input.Content).
		AddTagIDs(tagIDs...).
		SetCreatedBy(createdBy).
		SetUpdatedBy(createdBy).
		Save(ctx)

	if err != nil {
		return nil, err
	}
	post.Edges.CreatedBy = createdBy
	post.Edges.UpdatedBy = createdBy
	return post, err
}

func getTagIDs(ctx context.Context, client *ent.Client, tags []string) ([]int, error) {
	if len(tags) > 0 {
		var tagIDs []int
		for _, t := range tags {
			tag, err := client.Tag.Query().Where(tag.NameEQ(t)).First(ctx)
			if err == nil {
				tagIDs = append(tagIDs, tag.ID)
			} else {
				if ent.IsNotFound(err) {
					tag, err = client.Tag.Create().SetName(t).Save(ctx)
					if err != nil {
						return nil, err
					}
					tagIDs = append(tagIDs, tag.ID)
				} else {
					return nil, err
				}
			}
		}

		return tagIDs, nil
	}

	return make([]int, 0), nil
}

// Update a post
func Update(ctx context.Context, client *ent.Client, id int, input *model.UpdatePostIn) (*ent.Post, error) {
	u := client.Post.UpdateOneID(id)

	updatedBy := auth.ForContext(ctx)

	u.SetUpdatedBy(updatedBy)

	if input.TitleIn != nil && input.TitleIn.IsUpdate {
		u.SetTitle(input.TitleIn.Value)
	}
	if input.ShortDescriptionIn != nil && input.ShortDescriptionIn.IsUpdate {
		u.SetShortDescription(input.ShortDescriptionIn.Value)
	}
	if input.ContentIn != nil && input.ContentIn.IsUpdate {
		u.SetContent(input.ContentIn.Value)
	}
	if input.StatusIn != nil && input.StatusIn.IsUpdate {
		u.SetStatus(input.StatusIn.Value)
	}

	if input.TagsIn != nil && input.TagsIn.IsUpdate {
		tagIDs, err := getTagIDs(ctx, client, input.TagsIn.Value)
		if err != nil {
			return nil, err
		}
		u.ClearTags().AddTagIDs(tagIDs...)
	}

	post, err := u.Save(ctx)
	if err != nil {
		return nil, fmt.Errorf("Failed updating user: %v", err)
	}
	log.Println("Post was updated: ", u)

	createdBy, err := post.QueryCreatedBy().First(ctx)
	if err != nil {
		return nil, err
	}
	post.Edges.CreatedBy = createdBy
	post.Edges.UpdatedBy = updatedBy

	return post, nil
}

// Delete a post
func Delete(ctx context.Context, client *ent.Client, id *int) error {
	return client.Post.DeleteOneID(*id).Exec(ctx)
}

// Posts filter posts
func Posts(ctx context.Context, client *ent.Client, input *model.PostsIn) (*ent.PostConnection, error) {
	defaultFirst := 10
	defaultOrder := ent.WithPostOrder(&ent.PostOrder{Direction: ent.OrderDirectionDesc, Field: ent.PostOrderFieldCreateTime})
	if input == nil {
		return client.Post.Query().WithCreatedBy().WithUpdatedBy().WithTags().Paginate(ctx, nil, &defaultFirst, nil, nil, defaultOrder)
	}

	if input.PageIn == nil {
		input.PageIn = &model.PageIn{
			First: &defaultFirst,
		}
	}

	andConditions := []predicate.Post{}

	if input.Q != nil && len(strings.TrimSpace(*input.Q)) > 0 {
		or := []predicate.Post{}
		or = append(or, post.TitleContainsFold(*input.Q))
		or = append(or, post.ShortDescriptionContainsFold(*input.Q))
		or = append(or, post.ContentContainsFold(*input.Q))
		andConditions = append(andConditions, post.Or(or...))
	}

	if len(input.Statuses) > 0 {
		andConditions = append(andConditions, post.StatusIn(input.Statuses...))
	}

	if input.Tag != nil {
		andConditions = append(andConditions, post.HasTagsWith(tag.NameEQ(*input.Tag)))
	}

	return client.Post.Query().WithCreatedBy().WithUpdatedBy().WithTags().
		Where(
			post.And(andConditions...),
		).
		Paginate(ctx, input.PageIn.After, input.PageIn.First, input.PageIn.Before, input.PageIn.Last,
			defaultOrder,
		)
}

// PublishedPosts filter published posts
func PublishedPosts(ctx context.Context, client *ent.Client, input *model.PublishedPostsIn) (*ent.PostConnection, error) {
	defaultFirst := 10
	defaultOrder := ent.WithPostOrder(&ent.PostOrder{Direction: ent.OrderDirectionDesc, Field: ent.PostOrderFieldCreateTime})
	if input == nil {
		return client.Post.Query().WithCreatedBy().WithUpdatedBy().WithTags().Paginate(ctx, nil, &defaultFirst, nil, nil, defaultOrder)
	}

	if input.PageIn == nil {
		input.PageIn = &model.PageIn{
			First: &defaultFirst,
		}
	}

	andConditions := []predicate.Post{}

	if input.Q != nil && len(strings.TrimSpace(*input.Q)) > 0 {
		or := []predicate.Post{}
		or = append(or, post.TitleContainsFold(*input.Q))
		or = append(or, post.ShortDescriptionContainsFold(*input.Q))
		or = append(or, post.ContentContainsFold(*input.Q))
		andConditions = append(andConditions, post.Or(or...))
	}

	andConditions = append(andConditions, post.StatusEQ(post.StatusAPPROVED))

	if input.Tag != nil {
		andConditions = append(andConditions, post.HasTagsWith(tag.NameEQ(*input.Tag)))
	}

	return client.Post.Query().WithCreatedBy().WithUpdatedBy().WithTags().
		Where(
			post.And(andConditions...),
		).
		Paginate(ctx, input.PageIn.After, input.PageIn.First, input.PageIn.Before, input.PageIn.Last, defaultOrder)
}

// ByID get post by id
func ByID(ctx context.Context, client *ent.Client, id int) (*ent.Post, error) {
	res, err := client.Post.Query().WithCreatedBy().WithUpdatedBy().WithTags().Where(post.IDEQ(id)).First(ctx)
	if err != nil {
		return nil, err
	}

	if res.Status == post.StatusAPPROVED {
		return res, nil
	}

	currentUser := auth.ForContext(ctx)
	if currentUser == nil {
		return nil, &auth.AccessDenied{}
	}

	if res.Edges.CreatedBy.ID == currentUser.ID {
		return res, err
	}

	permissions := []model.Permission{model.PermissionPost, model.PermissionPostR}
	if user.HasAnyPermission(currentUser, permissions) {
		return res, nil
	}

	return nil, &auth.AccessDenied{}
}

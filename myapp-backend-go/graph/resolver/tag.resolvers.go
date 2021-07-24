package resolver

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.

import (
	"context"
	"strings"

	"github.com/diep-it-dn/fullstack-go-angular/myapp-backend-go/ent"
	"github.com/diep-it-dn/fullstack-go-angular/myapp-backend-go/ent/tag"
	"github.com/diep-it-dn/fullstack-go-angular/myapp-backend-go/graph/model"
)

func (r *mutationResolver) UpdateTag(ctx context.Context, id int, newName string) (*ent.Tag, error) {
	return r.client.Tag.UpdateOneID(id).SetName(newName).Save(ctx)
}

func (r *mutationResolver) DeleteTag(ctx context.Context, id int) (bool, error) {
	err := r.client.Tag.DeleteOneID(id).Exec(ctx)
	return err == nil, err
}

func (r *queryResolver) Tags(ctx context.Context, input *model.TagsIn) (*ent.TagConnection, error) {
	defaultFirst := 10
	defaultOrder := ent.WithTagOrder(&ent.TagOrder{Direction: ent.OrderDirectionAsc, Field: ent.TagOrderFieldName})
	if input == nil {
		return r.client.Tag.Query().Paginate(ctx, nil, &defaultFirst, nil, nil, defaultOrder)
	}

	if input.PageIn == nil {
		input.PageIn = &model.PageIn{
			First: &defaultFirst,
		}
	}

	if len(*input.Q) == 0 {
		return r.client.Tag.Query().Paginate(ctx, input.PageIn.After, input.PageIn.First, input.PageIn.Before, input.PageIn.Last, defaultOrder)
	}
	return r.client.Tag.Query().Where(tag.NameContainsFold(strings.TrimSpace(*input.Q))).Paginate(ctx, input.PageIn.After, input.PageIn.First, input.PageIn.Before, input.PageIn.Last, defaultOrder)
}

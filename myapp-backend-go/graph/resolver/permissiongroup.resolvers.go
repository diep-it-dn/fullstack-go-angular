package resolver

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.

import (
	"context"

	"github.com/diep-it-dn/fullstack-go-angular/myapp-backend-go/ent"
	"github.com/diep-it-dn/fullstack-go-angular/myapp-backend-go/graph/generated"
	"github.com/diep-it-dn/fullstack-go-angular/myapp-backend-go/graph/model"
	"github.com/diep-it-dn/fullstack-go-angular/myapp-backend-go/internal/permissiongroup"
)

func (r *mutationResolver) CreatePermissionGroup(ctx context.Context, input model.CreatePermissionGroupIn) (*ent.PermissionGroup, error) {
	return permissiongroup.Create(ctx, ent.FromContext(ctx), &input)
}

func (r *mutationResolver) UpdatePermissionGroup(ctx context.Context, id int, input model.UpdatePermissionGroupIn) (*ent.PermissionGroup, error) {
	return permissiongroup.Update(ctx, ent.FromContext(ctx), id, &input)
}

func (r *mutationResolver) DeletePermissionGroup(ctx context.Context, id int) (bool, error) {
	err := permissiongroup.Delete(ctx, ent.FromContext(ctx), id)
	return err == nil, err
}

func (r *permissionGroupResolver) Permissions(ctx context.Context, obj *ent.PermissionGroup) ([]model.Permission, error) {
	permissions := make([]model.Permission, len(obj.Permissions))
	for i, v := range obj.Permissions {
		permissions[i] = model.Permission(v)
	}

	return permissions, nil
}

func (r *queryResolver) PermissionAll(ctx context.Context) ([]model.Permission, error) {
	return model.AllPermission, nil
}

func (r *queryResolver) PermissionGroup(ctx context.Context, id int) (*ent.PermissionGroup, error) {
	res, err := r.client.PermissionGroup.Get(ctx, id)
	return res, err
}

func (r *queryResolver) PermissionGroups(ctx context.Context, input *model.PermissionGroupsIn) (*ent.PermissionGroupConnection, error) {
	return permissiongroup.PermissionGroups(ctx, r.client, input)
}

func (r *queryResolver) PermissionGroupAll(ctx context.Context) ([]*ent.PermissionGroup, error) {
	res, err := r.client.PermissionGroup.Query().All(ctx)
	return res, err
}

// PermissionGroup returns generated.PermissionGroupResolver implementation.
func (r *Resolver) PermissionGroup() generated.PermissionGroupResolver {
	return &permissionGroupResolver{r}
}

type permissionGroupResolver struct{ *Resolver }

package permissiongroup

import (
	"context"
	"fmt"
	"log"
	"strings"

	"github.com/diep-it-dn/fullstack-go-angular/myapp-backend-go/ent"
	"github.com/diep-it-dn/fullstack-go-angular/myapp-backend-go/ent/permissiongroup"
	"github.com/diep-it-dn/fullstack-go-angular/myapp-backend-go/ent/predicate"
	"github.com/diep-it-dn/fullstack-go-angular/myapp-backend-go/graph/model"
)

// Create new PermissionGroup
func Create(ctx context.Context, client *ent.Client, input *model.CreatePermissionGroupIn) (*ent.PermissionGroup, error) {
	permissions := convertPermissions(input.Permissions)

	permissionGroup, err := client.PermissionGroup.
		Create().
		SetName(input.Name).
		SetNillableDescription(input.Description).
		SetPermissions(permissions).
		Save(ctx)
	if err != nil {
		return nil, fmt.Errorf("Failed creating PermissionGroup: %v", err)
	}
	log.Println("PermissionGroup was created: ", permissionGroup)
	return permissionGroup, nil
}

func convertPermissions(permissions []model.Permission) []string {
	pers := make([]string, len(permissions))
	for i, permission := range permissions {
		pers[i] = permission.String()
	}
	return pers
}

// GetByName get by name
func GetByName(ctx context.Context, client *ent.Client, name string) (*ent.PermissionGroup, error) {
	return client.PermissionGroup.Query().Where(permissiongroup.NameEQ(name)).First(ctx)
}

// Update a PermissionGroup
func Update(ctx context.Context, client *ent.Client, id int, input *model.UpdatePermissionGroupIn) (*ent.PermissionGroup, error) {
	u := client.PermissionGroup.UpdateOneID(id)

	if input.NameIn != nil && input.NameIn.IsUpdate {
		u.SetName(input.NameIn.Value)
	}

	if input.DescriptionIn != nil && input.DescriptionIn.IsUpdate {
		if input.DescriptionIn.Value == nil {
			u.ClearDescription()
		} else {
			u.SetDescription(*input.DescriptionIn.Value)
		}
	}

	if input.PermissionsIn != nil && input.PermissionsIn.IsUpdate {
		if input.PermissionsIn.Value == nil {
			u.ClearPermissions()
		} else {
			u.SetPermissions(convertPermissions(input.PermissionsIn.Value))
		}
	}

	permissionGroup, err := u.Save(ctx)
	if err != nil {
		return nil, fmt.Errorf("Failed updating PermissionGroup: %v", err)
	}
	log.Println("PermissionGroup was updated: ", permissionGroup)
	return permissionGroup, nil
}

// PermissionGroups filter permission groups
func PermissionGroups(ctx context.Context, client *ent.Client, input *model.PermissionGroupsIn) (*ent.PermissionGroupConnection, error) {
	defaultFirst := 10
	if input == nil {
		return client.PermissionGroup.Query().Paginate(ctx, nil, &defaultFirst, nil, nil, ent.WithPermissionGroupOrder(nil))
	}

	if input.PageIn == nil {
		input.PageIn = &model.PageIn{
			First: &defaultFirst,
		}
	}

	andConditions := []predicate.PermissionGroup{}

	if input.Name != nil && len(strings.TrimSpace(*input.Name)) > 0 {
		andConditions = append(andConditions, permissiongroup.NameContainsFold(*input.Name))
	}

	return client.PermissionGroup.Query().
		Where(
			permissiongroup.And(andConditions...),
		).
		Paginate(ctx, input.PageIn.After, input.PageIn.First, input.PageIn.Before, input.PageIn.Last,
			ent.WithPermissionGroupOrder(input.OrderBy),
		)
}

// Delete a PermissionGroup
func Delete(ctx context.Context, client *ent.Client, id int) error {
	return client.PermissionGroup.DeleteOneID(id).Exec(ctx)
}

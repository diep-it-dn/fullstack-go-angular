package contentsetting

import (
	"context"

	"github.com/diep-it-dn/fullstack-go-angular/myapp-backend-go/ent"
	"github.com/diep-it-dn/fullstack-go-angular/myapp-backend-go/ent/contentsetting"
	"github.com/diep-it-dn/fullstack-go-angular/myapp-backend-go/graph/model"
)

// Create new ContentSetting
func Create(ctx context.Context, client *ent.Client, input *model.SetContentSettingIn) (*ent.ContentSetting, error) {
	contentSetting, err := client.ContentSetting.Create().
		SetName(input.Name).
		SetValue(input.Value).
		Save(ctx)

	if err != nil {
		return nil, err
	}
	return contentSetting, err
}

// Set a ContentSetting: if not exists create new, else update
func Set(ctx context.Context, client *ent.Client, input *model.SetContentSettingIn) (*ent.ContentSetting, error) {
	contentSetting, err := ContentSetting(ctx, client, input.Name)

	if err != nil {
		if ent.IsNotFound(err) {
			return Create(ctx, client, input)
		}
		return nil, err
	}

	return contentSetting.Update().
		SetValue(input.Value).
		Save(ctx)
}

// Delete a ContentSetting
func Delete(ctx context.Context, client *ent.Client, id *int) error {
	return client.ContentSetting.DeleteOneID(*id).Exec(ctx)
}

// ContentSettings filter ContentSettings
func ContentSettings(ctx context.Context, client *ent.Client) ([]*ent.ContentSetting, error) {
	return client.ContentSetting.Query().All(ctx)
}

// ContentSetting read a ContentSetting by name
func ContentSetting(ctx context.Context, client *ent.Client, name string) (*ent.ContentSetting, error) {
	return client.ContentSetting.Query().Where(contentsetting.NameEQ(name)).First(ctx)
}

package schema

import (
	"entgo.io/contrib/entgql"
	"entgo.io/ent"
	"entgo.io/ent/schema/field"
	"entgo.io/ent/schema/mixin"
)

// ContentSetting holds the schema definition for the ContentSetting entity.
type ContentSetting struct {
	ent.Schema
}

// Fields of the ContentSetting.
func (ContentSetting) Fields() []ent.Field {
	return []ent.Field{
		field.String("name").Unique().Annotations(entgql.OrderField("NAME")),
		field.String("value"),
	}
}

// Edges of the ContentSetting.
func (ContentSetting) Edges() []ent.Edge {
	return nil
}

// Mixin of the ContentSetting
func (ContentSetting) Mixin() []ent.Mixin {
	return []ent.Mixin{
		mixin.AnnotateFields(mixin.CreateTime{}, entgql.OrderField("CREATE_TIME")),
		mixin.AnnotateFields(mixin.UpdateTime{}, entgql.OrderField("UPDATE_TIME")),
	}
}

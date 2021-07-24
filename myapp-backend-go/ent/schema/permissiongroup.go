package schema

import (
	"entgo.io/contrib/entgql"
	"entgo.io/ent"
	"entgo.io/ent/schema/edge"
	"entgo.io/ent/schema/field"
	"entgo.io/ent/schema/index"
	"entgo.io/ent/schema/mixin"
)

// PermissionGroup holds the schema definition for the PermissionGroup entity.
type PermissionGroup struct {
	ent.Schema
}

// Fields of the PermissionGroup.
func (PermissionGroup) Fields() []ent.Field {
	return []ent.Field{
		field.String("name").Unique().NotEmpty().Annotations(entgql.OrderField("NAME")),
		field.String("description").Optional().Nillable().Annotations(entgql.OrderField("DESCRIPTION")),
		field.Strings("permissions").Optional(),
	}
}

// Edges of the PermissionGroup.
func (PermissionGroup) Edges() []ent.Edge {
	return []ent.Edge{
		edge.To("users", User.Type),
	}
}

// Mixin of the PermissionGroup
func (PermissionGroup) Mixin() []ent.Mixin {
	return []ent.Mixin{
		mixin.AnnotateFields(mixin.CreateTime{}, entgql.OrderField("CREATE_TIME")),
		mixin.AnnotateFields(mixin.UpdateTime{}, entgql.OrderField("UPDATE_TIME")),
	}
}

// Indexes of the PermissionGroup
func (PermissionGroup) Indexes() []ent.Index {
	return []ent.Index{
		index.Fields("description"),
	}
}

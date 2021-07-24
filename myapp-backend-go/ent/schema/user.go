package schema

import (
	"entgo.io/contrib/entgql"
	"entgo.io/ent"
	"entgo.io/ent/schema/edge"
	"entgo.io/ent/schema/field"
	"entgo.io/ent/schema/index"
	"entgo.io/ent/schema/mixin"
)

// User holds the schema definition for the User entity.
type User struct {
	ent.Schema
}

// Fields of the User.
func (User) Fields() []ent.Field {
	return []ent.Field{
		field.String("email").Unique().NotEmpty().Annotations(entgql.OrderField("EMAIL")),
		field.Bool("emailVerified").Default(false),
		field.String("password").NotEmpty(),
		field.Enum("status").
			Values("ENABLED", "DISABLED").
			Default("ENABLED").Annotations(entgql.OrderField("STATUS")),
		field.String("displayedName").Optional().Nillable().Annotations(entgql.OrderField("DISPLAYED_NAME")),
		field.String("firstName").Optional().Nillable().Annotations(entgql.OrderField("FIRST_NAME")),
		field.String("lastName").Optional().Nillable().Annotations(entgql.OrderField("LAST_NAME")),
		field.Time("birthday").Optional().Nillable().Annotations(entgql.OrderField("BIRTHDAY")),
		field.String("description").Optional().Nillable(),
		field.String("address").Optional().Nillable(),
		field.String("phoneNumber").Optional().Nillable(),
		field.String("avatarURL").Optional().Nillable(),
	}
}

// Edges of the User.
func (User) Edges() []ent.Edge {
	return []ent.Edge{
		edge.From("permissionGroups", PermissionGroup.Type).Ref("users"),
		edge.To("postCreatedBy", Post.Type).
			StorageKey(edge.Column("created_by")),
		edge.To("postUpdatedBy", Post.Type).
			StorageKey(edge.Column("updated_by")),
	}
}

// Mixin of the User
func (User) Mixin() []ent.Mixin {
	return []ent.Mixin{
		GenderMixin{},
		mixin.AnnotateFields(mixin.CreateTime{}, entgql.OrderField("CREATE_TIME")),
		mixin.AnnotateFields(mixin.UpdateTime{}, entgql.OrderField("UPDATE_TIME")),
	}
}

// Indexes of the User
func (User) Indexes() []ent.Index {
	return []ent.Index{
		index.Fields("status"),
		index.Fields("firstName"),
		index.Fields("lastName"),
		index.Fields("birthday"),
		index.Fields("gender"),
	}
}

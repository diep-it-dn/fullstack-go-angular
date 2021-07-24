package schema

import (
	"entgo.io/contrib/entgql"
	"entgo.io/ent"
	"entgo.io/ent/schema/field"
	"entgo.io/ent/schema/mixin"
)

// GenderMixin implements the ent.Mixin for sharing
// gender fields with package schemas.
type GenderMixin struct {
	mixin.Schema
}

// Fields define genders
func (GenderMixin) Fields() []ent.Field {
	return []ent.Field{
		field.Enum("gender").Optional().Nillable().Values("Male", "Female").Annotations(entgql.OrderField("GENDER")),
	}
}

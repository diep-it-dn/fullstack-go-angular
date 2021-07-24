package schema

import (
	"entgo.io/contrib/entgql"
	"entgo.io/ent"
	"entgo.io/ent/schema/edge"
	"entgo.io/ent/schema/field"
	"entgo.io/ent/schema/index"
	"entgo.io/ent/schema/mixin"
)

// Post holds the schema definition for the Post entity.
type Post struct {
	ent.Schema
}

// Fields of the Post.
func (Post) Fields() []ent.Field {
	return []ent.Field{
		field.String("title").Unique().NotEmpty().Annotations(entgql.OrderField("TITLE")),
		field.String("shortDescription").NotEmpty(),
		field.String("content").NotEmpty(),
		field.Enum("status").
			Values("DRAFT", "NEED_REVIEW", "REVIEWING", "NEED_UPDATE", "REJECTED", "APPROVED", "HIDDEN").
			Default("DRAFT").Annotations(entgql.OrderField("STATUS")),
	}
}

// Edges of the Post.
func (Post) Edges() []ent.Edge {
	return []ent.Edge{
		edge.From("createdBy", User.Type).
			Ref("postCreatedBy").
			Unique(),
		edge.From("updatedBy", User.Type).
			Ref("postUpdatedBy").
			Unique(),
		edge.From("tags", Tag.Type).
			Ref("posts"),
	}
}

// Mixin of the Post
func (Post) Mixin() []ent.Mixin {
	return []ent.Mixin{
		mixin.AnnotateFields(mixin.CreateTime{}, entgql.OrderField("CREATE_TIME")),
		mixin.AnnotateFields(mixin.UpdateTime{}, entgql.OrderField("UPDATE_TIME")),
	}
}

// Indexes of the Post
func (Post) Indexes() []ent.Index {
	return []ent.Index{
		index.Fields("title"),
		index.Fields("shortDescription"),
	}
}

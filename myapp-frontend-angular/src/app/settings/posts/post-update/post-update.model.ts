import { prop, required } from "@rxweb/reactive-form-validators";
import { PostStatus, Tag } from "src/generated/graphql";

export class PostUpdate {
    @required()
    status!: PostStatus;
    @required()
    title!: string;
    @required()
    shortDescription!: string;
    @required()
    content!: string;
    @prop()
    tags: Tag[] = [];
}

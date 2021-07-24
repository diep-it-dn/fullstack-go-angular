import { prop, required } from "@rxweb/reactive-form-validators";
import { Tag } from "src/generated/graphql";

export class PostCreate {
    @required()
    title!: string;
    @required()
    shortDescription!: string;
    @required()
    content!: string;
    @prop()
    tags: Tag[] = [];
}

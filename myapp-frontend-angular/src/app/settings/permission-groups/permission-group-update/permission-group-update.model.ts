import { prop, required } from "@rxweb/reactive-form-validators";

export class PermissionGroupUpdate {
    @required()
    name!: string;
    @prop()
    description?: string;
}


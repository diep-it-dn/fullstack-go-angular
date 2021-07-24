import { prop, required } from '@rxweb/reactive-form-validators';
import { Permission } from 'src/generated/graphql';

export class PermissionGroupCreate {
    @required()
    name!: string;
    @prop()
    description?: string;
    @prop()
    permissions: Permission[] = [];
}

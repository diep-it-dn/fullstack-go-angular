import { prop } from '@rxweb/reactive-form-validators';
import { Permission } from 'src/generated/graphql';

export class PermissionCheckbox {
    @prop()
    selected!: boolean;
    @prop()
    disabled!: boolean;
    @prop()
    name!: string;
}
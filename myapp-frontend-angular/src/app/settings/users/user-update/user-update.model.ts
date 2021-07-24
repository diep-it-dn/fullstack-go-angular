import { email, prop, required } from "@rxweb/reactive-form-validators";
import { Profile } from "src/app/auth/profile/profile.model";
import { UserStatus } from "src/generated/graphql";

export class UserUpdate extends Profile {
    @required()
    @email()
    email?: string;
    @prop()
    status!: UserStatus;
    @prop()
    permissionGroupIDs?: string[];
}
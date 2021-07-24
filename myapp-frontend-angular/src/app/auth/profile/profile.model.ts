import { prop } from "@rxweb/reactive-form-validators";
import { UserGender } from "src/generated/graphql";

export class Profile {
    @prop()
    displayedName?: string;
    @prop()
    firstName?: string;
    @prop()
    lastName?: string;
    @prop()
    gender?: UserGender;
    @prop()
    birthday?: Date;
    @prop()
    phoneNumber?: string;
    @prop()
    address?: string;
    @prop()
    description?: string;
    @prop()
    avatarURL?: string;
}
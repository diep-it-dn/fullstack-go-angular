import { compare, prop, required } from "@rxweb/reactive-form-validators";
import { Login } from "../login/login.model";

export class Register extends Login {
    @prop()
    firstName?: string;
    @prop()
    lastName?: string;
    @prop()
    displayedName?: string;
    @prop()
    gender?: string;
    @prop()
    birthday?: string;
    @prop()
    description?: string;
    @prop()
    address?: string;
    @prop()
    avatarURL?: string;
    @prop()
    phoneNumber?: string;
    @compare({ fieldName: "password" })
    confirmPassword?: string;
}
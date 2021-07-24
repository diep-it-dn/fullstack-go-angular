import { compare, password, required } from "@rxweb/reactive-form-validators";
import { UserUpdate } from "../user-update/user-update.model";

export class UserCreate extends UserUpdate {
    @required()
    @password({ validation: { minLength: 6, maxLength: 20/* , digit: true, specialCharacter: true  */ } })
    password?: string;
    @compare({ fieldName: "password" })
    confirmPassword?: string;
}
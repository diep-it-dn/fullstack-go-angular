import { compare, password, required } from "@rxweb/reactive-form-validators";

export class ChangePassword {
    @required()
    currentPassword?: string;
    @required()
    @password({ validation: { minLength: 6, maxLength: 20/* , digit: true, specialCharacter: true  */} })
    newPassword?: string;
    @compare({ fieldName: "newPassword" })
    confirmPassword?: string;
}
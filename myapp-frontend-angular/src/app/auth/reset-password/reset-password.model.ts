import { compare, password, required } from "@rxweb/reactive-form-validators";

export class ResetPassword {
    @required()
    @password({ validation: { minLength: 6, maxLength: 20/* , digit: true, specialCharacter: true  */ } })
    newPassword?: string;
    @compare({ fieldName: "newPassword" })
    confirmNewPassword?: string;
}

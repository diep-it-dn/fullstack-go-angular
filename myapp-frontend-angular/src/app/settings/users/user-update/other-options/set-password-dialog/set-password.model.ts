import { compare, password, required } from "@rxweb/reactive-form-validators";

export class SetPassword {
    @required()
    @password({ validation: { minLength: 6, maxLength: 20/* , digit: true, specialCharacter: true  */ } })
    password!: string;
    @compare({ fieldName: "password" })
    confirmPassword!: string;
}
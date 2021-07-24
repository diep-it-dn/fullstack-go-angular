import { email, password, required } from "@rxweb/reactive-form-validators";

export class Login {
    @required()
    @email()
    email?: string;
    @required()
    @password({ validation: { minLength: 6, maxLength: 20/* , digit: true, specialCharacter: true  */} })
    password?: string;
}
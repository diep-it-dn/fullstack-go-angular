import { email, required } from "@rxweb/reactive-form-validators";

export class ForgotPassword {
    @required()
    @email()
    email?: string;
}
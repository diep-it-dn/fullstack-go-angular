import { email, required } from "@rxweb/reactive-form-validators";

export class SetEmail {
    @required()
    @email()
    email!: string;
}
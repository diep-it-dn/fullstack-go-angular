import { FormGroup } from "@angular/forms";

export class BaseForm {
    type!: FormType;
    form!: FormGroup;
    loading = false;
    err: string | undefined;
    title = 'Form';
    submitName = "OK";
}

export enum FormType {
    CREATE,
    UPDATE,
    DELETE,
    REGISTER
}
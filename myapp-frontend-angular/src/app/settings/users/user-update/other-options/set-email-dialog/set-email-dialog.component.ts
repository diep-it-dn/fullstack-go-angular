import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RxFormBuilder } from '@rxweb/reactive-form-validators';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AbstractBaseFormComponent } from 'src/app/shared/components/base-form/abstract-base-form.component';
import { FormType } from 'src/app/shared/components/base-form/base-form.model';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { UpdateUserGQL, UpdateUserIn, User } from 'src/generated/graphql';
import { SetEmail } from './set-email.model';

@Component({
  selector: 'app-set-email-dialog',
  templateUrl: './set-email-dialog.component.html',
  styleUrls: ['./set-email-dialog.component.scss']
})
export class SetEmailDialogComponent extends AbstractBaseFormComponent<SetEmail, User> implements OnInit {

  permissionGroupAll: any;

  constructor(
    private dialogRef: MatDialogRef<SetEmailDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private id: string,
    private updateUserGQL: UpdateUserGQL,
    protected formBuilder: RxFormBuilder,
    protected notificationService: NotificationService,
  ) {
    super(formBuilder, notificationService);
    this.baseForm.type = FormType.UPDATE;
    this.baseForm.title = "Set Email";
    this.baseForm.submitName = "Update";
  }

  ngOnInit(): void {
    super.ngOnInit();
  }

  newT(): SetEmail {
    return new SetEmail();
  }

  submit(): Observable<User> {
    const setEmail: SetEmail = this.baseForm.form.value;
    const input: UpdateUserIn = {
      emailIn: {
        isUpdate: true,
        value: setEmail.email
      },
    }
    return this.updateUserGQL.mutate({ id: this.id, input }).pipe(map(res => res.data!.updateUser as User));
  }

  afterSubmitOK(res: User): void {
    this.dialogRef.close({updatedEmail: res.email});
  }

}

import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RxFormBuilder } from '@rxweb/reactive-form-validators';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AbstractBaseFormComponent } from 'src/app/shared/components/base-form/abstract-base-form.component';
import { FormType } from 'src/app/shared/components/base-form/base-form.model';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { UpdateUserGQL, UpdateUserIn, User } from 'src/generated/graphql';
import { SetPassword } from './set-password.model';

@Component({
  selector: 'app-set-password-dialog',
  templateUrl: './set-password-dialog.component.html',
  styleUrls: ['./set-password-dialog.component.scss']
})
export class SetPasswordDialogComponent extends AbstractBaseFormComponent<SetPassword, User> implements OnInit {

  permissionGroupAll: any;

  constructor(
    private dialogRef: MatDialogRef<SetPasswordDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private id: string,
    private updateUserGQL: UpdateUserGQL,
    protected formBuilder: RxFormBuilder,
    protected notificationService: NotificationService,
  ) {
    super(formBuilder, notificationService);
    this.baseForm.type = FormType.UPDATE;
    this.baseForm.title = "Set Password";
    this.baseForm.submitName = "Update";
  }

  ngOnInit(): void {
    super.ngOnInit();
  }

  newT(): SetPassword {
    return new SetPassword();
  }

  submit(): Observable<User> {
    const setPassword: SetPassword = this.baseForm.form.value;
    const input: UpdateUserIn = {
      passwordIn: {
        isUpdate: true,
        value: setPassword.password
      },
    }
    return this.updateUserGQL.mutate({ id: this.id, input }).pipe(map(res => res.data!.updateUser as User));
  }

  afterSubmitOK(_res: User): void {
    this.dialogRef.close();
  }

}

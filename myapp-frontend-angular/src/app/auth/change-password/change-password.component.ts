import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RxFormBuilder } from '@rxweb/reactive-form-validators';
import { Observable } from 'rxjs';
import { AbstractBaseFormComponent } from 'src/app/shared/components/base-form/abstract-base-form.component';
import { FormType } from 'src/app/shared/components/base-form/base-form.model';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { ChangePassword } from './change-password.model';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent extends AbstractBaseFormComponent<ChangePassword, boolean> implements OnInit {

  constructor(
    private authService: AuthService,
    private router: Router,
    protected formBuilder: RxFormBuilder,
    protected notificationService: NotificationService,
  ) {
    super(formBuilder, notificationService);
    this.baseForm.type = FormType.UPDATE;
    this.baseForm.title = "Change password";
  }

  newT(): ChangePassword {
    return new ChangePassword();
  }

  submit(): Observable<boolean> {
    const input = Object.assign({}, this.baseForm.form.value);
    delete input.confirmPassword;
    return this.authService.changePassword(input);
  }

  afterSubmitOK(res: boolean): void {
    if (res) {
      this.router.navigate(['auth', 'login']);
    } else {
      this.notificationService.updateError();
    }
  }

}

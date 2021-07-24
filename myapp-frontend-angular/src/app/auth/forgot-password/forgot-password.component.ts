import { Component, OnInit } from '@angular/core';
import { RxFormBuilder } from '@rxweb/reactive-form-validators';
import { Observable } from 'rxjs';
import { AbstractBaseFormComponent } from 'src/app/shared/components/base-form/abstract-base-form.component';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { ForgotPassword } from './forgot-password.model';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent extends AbstractBaseFormComponent<ForgotPassword, boolean> implements OnInit {

  constructor(
    private authService: AuthService,
    protected formBuilder: RxFormBuilder,
    protected notificationService: NotificationService,
  ) {
    super(formBuilder, notificationService);
    this.baseForm.title = "Forgot Password";
  }

  newT(): ForgotPassword {
    return new ForgotPassword();
  }

  submit(): Observable<boolean> {
    return this.authService.forgotPassword(this.baseForm.form.get('email')!.value);
  }

  afterSubmitOK(res: boolean): void {
    if (res) {
      this.notificationService.success("We've just sent you an email, please follow the instruction in the email to reset your password.");
    } else {
      this.notificationService.updateError();
    }
  }

}

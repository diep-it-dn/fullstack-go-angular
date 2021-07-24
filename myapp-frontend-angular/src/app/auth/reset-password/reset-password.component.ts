import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { RxFormBuilder } from '@rxweb/reactive-form-validators';
import { Observable } from 'rxjs';
import { AbstractBaseFormComponent } from 'src/app/shared/components/base-form/abstract-base-form.component';
import { AuthService } from 'src/app/shared/services/auth.service';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { ResetPassword } from './reset-password.model';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent extends AbstractBaseFormComponent<ResetPassword, boolean> implements OnInit {

  token!: string;

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    protected formBuilder: RxFormBuilder,
    protected notificationService: NotificationService,
  ) {
    super(formBuilder, notificationService);
    this.baseForm.title = "Reset password";
  }

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.token = params.token;
      super.ngOnInit();
    });
  }

  newT(): ResetPassword {
    return new ResetPassword();
  }

  submit(): Observable<boolean> {
    const input = Object.assign({}, this.baseForm.form.value);
    delete input.confirmNewPassword;
    input.token = this.token;

    return this.authService.resetPassword(input);
  }

  afterSubmitOK(res: boolean): void {
    if (res) {
      this.notificationService.success("Reset password successfully. You can login with your new password");
      this.router.navigate(['auth', 'login']);
    } else {
      this.notificationService.updateError();
    }
  }

}

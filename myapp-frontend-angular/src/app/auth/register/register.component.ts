import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RxFormBuilder } from '@rxweb/reactive-form-validators';
import { Observable } from 'rxjs';
import { AbstractBaseFormComponent } from 'src/app/shared/components/base-form/abstract-base-form.component';
import { FormType } from 'src/app/shared/components/base-form/base-form.model';
import { AuthService } from 'src/app/shared/services/auth.service';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { RegisterUserOut } from 'src/generated/graphql';
import { Register } from './register.model';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent extends AbstractBaseFormComponent<Register, RegisterUserOut> implements OnInit {


  constructor(
    private authService: AuthService,
    private router: Router,
    protected formBuilder: RxFormBuilder,
    protected notificationService: NotificationService,
  ) {
    super(formBuilder, notificationService);
    this.baseForm.type = FormType.REGISTER;
    this.baseForm.title = "Register";
  }

  newT(): Register {
    return new Register();
  }

  submit(): Observable<RegisterUserOut> {
    const input = Object.assign({}, this.baseForm.form.value);
    delete input.confirmPassword;
    if (input.birthday) {
      input.birthday += 'T00:00:00.000Z';
    }
    return this.authService.register(input);
  }

  afterSubmitOK(_res: RegisterUserOut): void {
    this.router.navigate(['auth', 'profile']);
  }

}

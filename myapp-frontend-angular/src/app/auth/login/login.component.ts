import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RxFormBuilder } from '@rxweb/reactive-form-validators';
import { Observable } from 'rxjs';
import { AbstractBaseFormComponent } from 'src/app/shared/components/base-form/abstract-base-form.component';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { LoginOut } from 'src/generated/graphql';
import { AuthService } from 'src/app/shared/services/auth.service';
import { Login } from './login.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent extends AbstractBaseFormComponent<Login, LoginOut> implements OnInit {

  returnUrl!: string;
  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    protected formBuilder: RxFormBuilder,
    protected notificationService: NotificationService,
  ) {
    super(formBuilder, notificationService);
    this.baseForm.title = "Login";
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  newT(): Login {
    return new Login();
  }

  submit(): Observable<LoginOut> {
    return this.authService.login(this.baseForm.form.value);
  }

  afterSubmitOK(_res: LoginOut): void {
    this.router.navigateByUrl(this.returnUrl);
  }

}

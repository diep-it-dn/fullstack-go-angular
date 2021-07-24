import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RxFormBuilder } from '@rxweb/reactive-form-validators';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AbstractBaseFormComponent } from 'src/app/shared/components/base-form/abstract-base-form.component';
import { FormType } from 'src/app/shared/components/base-form/base-form.model';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { CreateUserGQL, PermissionGroupAllGQL, User } from 'src/generated/graphql';
import { UserCreate } from './user-create.model';

@Component({
  selector: 'app-user-create',
  templateUrl: './user-create.component.html',
  styleUrls: ['./user-create.component.scss']
})
export class UserCreateComponent extends AbstractBaseFormComponent<UserCreate, User> implements OnInit {

  permissionGroupAll: any;
  constructor(
    protected formBuilder: RxFormBuilder,
    protected notificationService: NotificationService,
    private createUserGQL: CreateUserGQL,
    private permissionGroupAllGQL: PermissionGroupAllGQL,
    private router: Router,
  ) {
    super(formBuilder, notificationService);
    this.baseForm.title = "New User";
    this.baseForm.type = FormType.CREATE;
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.permissionGroupAllGQL.fetch().subscribe(res => this.permissionGroupAll = res.data.permissionGroupAll);
  }

  newT(): UserCreate {
    const userCreate = new UserCreate();
    return userCreate;
  }

  submit(): Observable<User> {
    const input = Object.assign({}, this.form.value);
    delete input.status;
    delete input.confirmPassword;
    if (input.birthday) {
      input.birthday += 'T00:00:00.000Z';
    }
    return this.createUserGQL.mutate({ input: input }).pipe(map(res => {
      return res.data!.createUser as User;
    }));
  }

  afterSubmitOK(res: User): void {
    this.router.navigate([this.router.url.substr(0, this.router.url.lastIndexOf('/new')), res.id]);
  }
}

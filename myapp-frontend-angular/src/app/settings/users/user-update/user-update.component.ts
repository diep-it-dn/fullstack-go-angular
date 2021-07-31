import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { RxFormBuilder } from '@rxweb/reactive-form-validators';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AbstractBaseFormComponent } from 'src/app/shared/components/base-form/abstract-base-form.component';
import { FormType } from 'src/app/shared/components/base-form/base-form.model';
import { AuthService } from 'src/app/shared/services/auth.service';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { PermissionGroupAllGQL, UpdateUserGQL, UpdateUserIn, User, UserByIdGQL } from 'src/generated/graphql';
import { UserUpdate } from './user-update.model';

@Component({
  selector: 'app-user-update',
  templateUrl: './user-update.component.html',
  styleUrls: ['./user-update.component.scss']
})
export class UserUpdateComponent extends AbstractBaseFormComponent<UserUpdate, User> implements OnInit {

  permissionGroupAll: any;
  id!: string;

  constructor(
    private route: ActivatedRoute,
    private userByIdGQL: UserByIdGQL,
    private updateUserGQL: UpdateUserGQL,
    private permissionGroupAllGQL: PermissionGroupAllGQL,
    protected formBuilder: RxFormBuilder,
    protected notificationService: NotificationService,
    private authService: AuthService,
  ) {
    super(formBuilder, notificationService);
    this.baseForm.type = FormType.UPDATE;
    this.baseForm.title = "Update User";
    this.baseForm.submitName = "Update";
  }

  ngOnInit(): void {
    super.ngOnInit();

    this.permissionGroupAllGQL.fetch({}, { fetchPolicy: 'no-cache' }).subscribe(res => this.permissionGroupAll = res.data.permissionGroupAll);

    this.route.params.subscribe((queryParams: Params) => {
      this.id = queryParams.id;

      this.userByIdGQL.fetch({ id: this.id }).subscribe(res => {
        this.form.patchValue(res.data.user);
        this.form.get('email')!.disable();
        const permissionGroupIDs: string[] = [];
        res.data.user!.permissionGroups!.forEach(permissionGroup => {
          permissionGroupIDs.push(permissionGroup.id);
        });

        this.form.get('permissionGroupIDs')!.setValue(permissionGroupIDs);

        if (this.form.get('birthday')!.value) {
          this.form.get('birthday')!.setValue(this.form.get('birthday')?.value.split('T')[0]);
        }
      });
    });

  }

  newT(): UserUpdate {
    return new UserUpdate();
  }

  submit(): Observable<User> {
    const user: UserUpdate = this.baseForm.form.value;
    const input: UpdateUserIn = {
      statusIn: {
        isUpdate: true,
        value: user.status
      },
      permissionGroupIDsIn: {
        isUpdate: true,
        value: user.permissionGroupIDs,
      },
      displayedNameIn: {
        isUpdate: true,
        value: user.displayedName
      },
      firstNameIn: {
        isUpdate: true,
        value: user.firstName
      },
      lastNameIn: {
        isUpdate: true,
        value: user.lastName
      },
      birthdayIn: {
        isUpdate: true,
        value: user.birthday ? (user.birthday + 'T00:00:00.000Z') : null
      },
      genderIn: {
        isUpdate: true,
        value: user.gender
      }
    }
    return this.updateUserGQL.mutate({ id: this.id, input }).pipe(map(res => res.data!.updateUser as User));
  }

  afterSubmitOK(_res: User): void {
    this.authService.getCurrentUser();
  }

  onUpdatedEmail(newEmail: string): void {
    this.form.get('email')!.setValue(newEmail);
  }

}

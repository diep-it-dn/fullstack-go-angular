import { Component, OnInit } from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { ActivatedRoute, Params } from '@angular/router';
import { RxFormBuilder } from '@rxweb/reactive-form-validators';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AbstractBaseFormComponent } from 'src/app/shared/components/base-form/abstract-base-form.component';
import { FormType } from 'src/app/shared/components/base-form/base-form.model';
import { AuthService } from 'src/app/shared/services/auth.service';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { Permission, PermissionGroup, PermissionGroupByIdGQL, UpdatePermissionGroupGQL, UpdatePermissionGroupIn } from 'src/generated/graphql';
import { PermissionGroupUpdate } from './permission-group-update.model';

class PermissionCheckbox {
  name!: string;
  checked!: boolean;
}

@Component({
  selector: 'app-permission-group-update',
  templateUrl: './permission-group-update.component.html',
  styleUrls: ['./permission-group-update.component.scss']
})
export class PermissionGroupUpdateComponent extends AbstractBaseFormComponent<PermissionGroupUpdate, PermissionGroup> implements OnInit {

  permissions: Array<PermissionCheckbox> = new Array();
  selectedPermissions!: Array<Permission>;
  id!: string;

  constructor(
    private route: ActivatedRoute,
    private permissionGroupByIdGQL: PermissionGroupByIdGQL,
    private updatePermissionGroupGQL: UpdatePermissionGroupGQL,
    protected formBuilder: RxFormBuilder,
    protected notificationService: NotificationService,
    private authService: AuthService,
  ) {
    super(formBuilder, notificationService);
    this.baseForm.type = FormType.UPDATE;
    this.baseForm.title = "Update Permission Group";
    this.baseForm.submitName = "Update";
  }

  ngOnInit(): void {
    super.ngOnInit();

    this.route.params.subscribe((queryParams: Params) => {
      this.id = queryParams.id;

      this.permissionGroupByIdGQL.fetch({ id: this.id }).subscribe(res => {
        this.form.patchValue(res.data.permissionGroup);
        this.selectedPermissions = new Array();
        this.selectedPermissions.push(...res.data.permissionGroup.permissions);

        Object.values(Permission).forEach(p => {
          if (res.data.permissionGroup.permissions.includes(p)) {
            this.permissions.push({ name: p, checked: true });
          } else {
            this.permissions.push({ name: p, checked: false });
          }
        });

      });
    });

  }

  newT(): PermissionGroupUpdate {
    return new PermissionGroupUpdate();
  }

  submit(): Observable<PermissionGroup> {
    const permissionGroup: PermissionGroupUpdate = this.baseForm.form.value;
    const input: UpdatePermissionGroupIn = {
      nameIn: {
        isUpdate: true,
        value: permissionGroup.name
      },
      descriptionIn: {
        isUpdate: true,
        value: permissionGroup.description
      },
      permissionsIn: {
        isUpdate: true,
        value: this.selectedPermissions
      }
    }
    return this.updatePermissionGroupGQL.mutate({ id: this.id, input }).pipe(map(res => res.data!.updatePermissionGroup));
  }

  afterSubmitOK(_res: PermissionGroup): void {
    this.authService.getCurrentUser();
  }

  onChange(event: MatCheckboxChange): void {
    this.form.markAsDirty();
    if (event.checked) {
      this.selectedPermissions.push(<Permission>event.source.value);
    } else {
      const i = this.selectedPermissions.findIndex(x => x === event.source.value);
      this.selectedPermissions.splice(i, 1);
    }
  }

}

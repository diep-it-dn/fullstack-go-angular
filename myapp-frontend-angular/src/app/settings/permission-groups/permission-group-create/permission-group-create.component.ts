import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RxFormBuilder } from '@rxweb/reactive-form-validators';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AbstractBaseFormComponent } from 'src/app/shared/components/base-form/abstract-base-form.component';
import { FormType } from 'src/app/shared/components/base-form/base-form.model';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { CreatePermissionGroupGQL, Permission, PermissionGroup } from 'src/generated/graphql';
import { PermissionGroupCreate } from './permission-group-create.model';

@Component({
  selector: 'app-permission-group-create',
  templateUrl: './permission-group-create.component.html',
  styleUrls: ['./permission-group-create.component.scss']
})
export class PermissionGroupCreateComponent extends AbstractBaseFormComponent<PermissionGroupCreate, PermissionGroup> implements OnInit {

  permissionAll = Object.values(Permission);
  constructor(
    protected formBuilder: RxFormBuilder,
    protected notificationService: NotificationService,
    private createPermissionGroupGQL: CreatePermissionGroupGQL,
    private router: Router,
  ) {
    super(formBuilder, notificationService);
    this.baseForm.title = "New Permission Group";
    this.baseForm.type = FormType.CREATE;
  }

  ngOnInit(): void {
    super.ngOnInit();
  }

  newT(): PermissionGroupCreate {
    const permissionGroupCreate = new PermissionGroupCreate();
    return permissionGroupCreate;
  }

  submit(): Observable<PermissionGroup> {
    return this.createPermissionGroupGQL.mutate({ input: this.form.value }).pipe(map(res => {
      return res.data!.createPermissionGroup;
    }));
  }

  afterSubmitOK(res: PermissionGroup): void {
    this.router.navigate([this.router.url.substr(0, this.router.url.lastIndexOf('/new')), res.id]);
  }

  onChange(event: any): void {
    const permissions = this.form.get('permissions')!.value as Permission[];

    if (event.checked) {
      permissions.push(<Permission>event.source.value);
    } else {
      const i = permissions.findIndex(x => x === event.source.value);
      permissions.splice(i, 1);
    }
  }
}

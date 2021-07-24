import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PermissionGroupsRoutingModule } from './permission-groups-routing.module';
import { PermissionGroupsComponent } from './permission-groups.component';
import { PermissionGroupCreateComponent } from './permission-group-create/permission-group-create.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { PermissionGroupListComponent } from './permission-group-list/permission-group-list.component';
import { PermissionGroupUpdateComponent } from './permission-group-update/permission-group-update.component';


@NgModule({
  declarations: [PermissionGroupsComponent, PermissionGroupCreateComponent, PermissionGroupListComponent, PermissionGroupUpdateComponent],
  imports: [
    CommonModule,
    PermissionGroupsRoutingModule,
    SharedModule,
  ]
})
export class PermissionGroupsModule { }

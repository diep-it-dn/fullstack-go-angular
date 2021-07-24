import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PermissionGuard } from 'src/app/auth/shared/permission.guard';
import { PermissionGroupCreateComponent } from './permission-group-create/permission-group-create.component';
import { PermissionGroupUpdateComponent } from './permission-group-update/permission-group-update.component';
import { PermissionGroupsComponent } from './permission-groups.component';


const routes: Routes = [
  {
    path: '', component: PermissionGroupsComponent,
    canActivate: [PermissionGuard],
    data: { anyPermissions: ['PERMISSION_GROUP', 'PERMISSION_GROUP_R'] }
  },
  {
    path: 'new', component: PermissionGroupCreateComponent,
    canActivate: [PermissionGuard],
    data: { anyPermissions: ['PERMISSION_GROUP', 'PERMISSION_GROUP_C'] }
  },
  {
    path: ':id', component: PermissionGroupUpdateComponent,
    canActivate: [PermissionGuard],
    data: { anyPermissions: ['PERMISSION_GROUP', 'PERMISSION_GROUP_R', 'PERMISSION_GROUP_U'] }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PermissionGroupsRoutingModule { }

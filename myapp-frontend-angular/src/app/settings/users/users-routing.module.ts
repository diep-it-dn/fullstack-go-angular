import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PermissionGuard } from 'src/app/auth/shared/permission.guard';
import { UserCreateComponent } from './user-create/user-create.component';
import { UserUpdateComponent } from './user-update/user-update.component';
import { UsersComponent } from './users.component';


const routes: Routes = [
  {
    path: '', component: UsersComponent,
    canActivate: [PermissionGuard],
    data: { anyPermissions: ['USER', 'USER_R'] }
  },
  {
    path: 'new', component: UserCreateComponent,
    canActivate: [PermissionGuard],
    data: { anyPermissions: ['USER', 'USER_C'] }
  },
  {
    path: ':id', component: UserUpdateComponent,
    canActivate: [PermissionGuard],
    data: { anyPermissions: ['USER', 'USER_R', 'USER_U'] }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersRoutingModule { }

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { UserListComponent } from './user-list/user-list.component';
import { OtherOptionsComponent } from './user-update/other-options/other-options.component';
import { SetPasswordDialogComponent } from './user-update/other-options/set-password-dialog/set-password-dialog.component';
import { UserUpdateComponent } from './user-update/user-update.component';
import { UsersRoutingModule } from './users-routing.module';
import { UsersComponent } from './users.component';
import { SetEmailDialogComponent } from './user-update/other-options/set-email-dialog/set-email-dialog.component';
import { UserCreateComponent } from './user-create/user-create.component';

@NgModule({
  declarations: [UsersComponent, UserListComponent, UserUpdateComponent, OtherOptionsComponent, SetPasswordDialogComponent, SetEmailDialogComponent, UserCreateComponent,],
  imports: [
    CommonModule,
    UsersRoutingModule,
    SharedModule,
  ]
})
export class UsersModule { }

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthComponent } from './auth.component';
import { AuthGuard } from './shared/auth.guard';

const routes: Routes = [
  { path: '', component: AuthComponent },
  { path: 'register', loadChildren: () => import('./register/register.module').then(m => m.RegisterModule) },
  { path: 'login', loadChildren: () => import('./login/login.module').then(m => m.LoginModule) },
  { path: 'forgot-password', loadChildren: () => import('./forgot-password/forgot-password.module').then(m => m.ForgotPasswordModule) },
  { path: 'logout', loadChildren: () => import('./logout/logout.module').then(m => m.LogoutModule) },
  { path: 'reset-password/:token', loadChildren: () => import('./reset-password/reset-password.module').then(m => m.ResetPasswordModule) },
  {
    path: 'change-password', component: AuthComponent, loadChildren: () => import('./change-password/change-password.module').then(m => m.ChangePasswordModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'profile', component: AuthComponent, loadChildren: () => import('./profile/profile.module').then(m => m.ProfileModule),
    canActivate: [AuthGuard],
  }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }

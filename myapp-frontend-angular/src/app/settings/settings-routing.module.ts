import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SettingsComponent } from './settings.component';


const routes: Routes = [
  { path: '', component: SettingsComponent },
  { path: 'permission-groups', component: SettingsComponent, loadChildren: () => import('./permission-groups/permission-groups.module').then(m => m.PermissionGroupsModule) },
  { path: 'users', component: SettingsComponent, loadChildren: () => import('./users/users.module').then(m => m.UsersModule) },
  { path: 'contents', component: SettingsComponent, loadChildren: () => import('./content-settings/content-settings.module').then(m => m.ContentSettingsModule) },
  { path: 'posts', component: SettingsComponent, loadChildren: () => import('./posts/posts.module').then(m => m.PostsModule) },
  { path: 'error', component: SettingsComponent, loadChildren: () => import('../error/error.module').then(m => m.ErrorModule) },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingsRoutingModule { }

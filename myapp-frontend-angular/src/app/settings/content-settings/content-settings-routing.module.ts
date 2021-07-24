import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PermissionGuard } from 'src/app/auth/shared/permission.guard';

import { ContentSettingsComponent } from './content-settings.component';

const routes: Routes = [
  {
    path: '', component: ContentSettingsComponent,
    canActivate: [PermissionGuard],
    data: { anyPermissions: ['CONTENT_SETTING', 'CONTENT_SETTING_S'] }
  }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContentSettingsRoutingModule { }

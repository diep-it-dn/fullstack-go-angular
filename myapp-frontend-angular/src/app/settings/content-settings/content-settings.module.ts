import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ContentSettingsRoutingModule } from './content-settings-routing.module';
import { ContentSettingsComponent } from './content-settings.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ContentSettingDetailsComponent } from './content-setting-details/content-setting-details.component';


@NgModule({
  declarations: [ContentSettingsComponent, ContentSettingDetailsComponent],
  imports: [
    CommonModule,
    ContentSettingsRoutingModule,
    SharedModule,
  ]
})
export class ContentSettingsModule { }

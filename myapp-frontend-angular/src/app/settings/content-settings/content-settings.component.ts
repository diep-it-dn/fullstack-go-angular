import { Component } from '@angular/core';
import { ContentSetting, ContentSettingTab } from './content-setting.constant';

@Component({
  selector: 'app-content-settings',
  templateUrl: './content-settings.component.html',
  styleUrls: ['./content-settings.component.scss']
})
export class ContentSettingsComponent {

  uiContents: ContentSettingTab[] = [
    ContentSetting.aboutApp, ContentSetting.aboutAuthor
  ];

  constructor() { }


}

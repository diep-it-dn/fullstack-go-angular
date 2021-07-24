import { Component, OnInit } from '@angular/core';
import { ContentSettingByNameGQL } from 'src/generated/graphql';
import { ContentSetting, ContentSettingTab } from '../settings/content-settings/content-setting.constant';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {
  aboutTabs: ContentSettingTab[] = [
    ContentSetting.aboutApp, ContentSetting.aboutAuthor
  ];

  constructor(
    private uiContentByNameGQL: ContentSettingByNameGQL
  ) { }

  ngOnInit(): void {
    this.aboutTabs.forEach(aboutTab => {
      this.uiContentByNameGQL.watch({ name: aboutTab.name }).valueChanges.subscribe(res => aboutTab.content = res.data!.contentSetting!.value);
    });

  }

}

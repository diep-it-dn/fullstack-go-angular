export class ContentSettingTab {
    name!: string;
    label!: string;
    content!: string;
}

export const ContentSetting = {
    aboutApp: { name: 'aboutApp', label: 'About Application' } as ContentSettingTab,
    aboutAuthor: { name: 'aboutAuthor', label: 'About Author' } as ContentSettingTab,
};


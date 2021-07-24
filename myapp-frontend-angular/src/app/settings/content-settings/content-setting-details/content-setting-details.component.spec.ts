import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentSettingDetailsComponent } from './content-setting-details.component';

describe('ContentSettingDetailsComponent', () => {
  let component: ContentSettingDetailsComponent;
  let fixture: ComponentFixture<ContentSettingDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContentSettingDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentSettingDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

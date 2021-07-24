import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentSettingsComponent } from './content-settings.component';

describe('ContentSettingsComponent', () => {
  let component: ContentSettingsComponent;
  let fixture: ComponentFixture<ContentSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContentSettingsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

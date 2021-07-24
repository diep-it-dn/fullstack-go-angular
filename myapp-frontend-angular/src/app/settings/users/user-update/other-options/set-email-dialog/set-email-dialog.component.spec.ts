import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SetEmailDialogComponent } from './set-email-dialog.component';

describe('SetEmailDialogComponent', () => {
  let component: SetEmailDialogComponent;
  let fixture: ComponentFixture<SetEmailDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SetEmailDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SetEmailDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

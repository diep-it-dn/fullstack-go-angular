import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PermissionGroupCreateComponent } from './permission-group-create.component';

describe('PermissionGroupCreateComponent', () => {
  let component: PermissionGroupCreateComponent;
  let fixture: ComponentFixture<PermissionGroupCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PermissionGroupCreateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PermissionGroupCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

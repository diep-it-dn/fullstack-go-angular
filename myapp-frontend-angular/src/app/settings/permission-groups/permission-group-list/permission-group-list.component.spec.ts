import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PermissionGroupListComponent } from './permission-group-list.component';

describe('PermissionGroupListComponent', () => {
  let component: PermissionGroupListComponent;
  let fixture: ComponentFixture<PermissionGroupListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PermissionGroupListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PermissionGroupListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

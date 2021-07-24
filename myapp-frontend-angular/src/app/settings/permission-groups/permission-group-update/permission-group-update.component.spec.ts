import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PermissionGroupUpdateComponent } from './permission-group-update.component';

describe('PermissionGroupUpdateComponent', () => {
  let component: PermissionGroupUpdateComponent;
  let fixture: ComponentFixture<PermissionGroupUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PermissionGroupUpdateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PermissionGroupUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

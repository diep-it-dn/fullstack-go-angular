import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OtherOptionsComponent } from './other-options.component';

describe('OtherOptionsComponent', () => {
  let component: OtherOptionsComponent;
  let fixture: ComponentFixture<OtherOptionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OtherOptionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OtherOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

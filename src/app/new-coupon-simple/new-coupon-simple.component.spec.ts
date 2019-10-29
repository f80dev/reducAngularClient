import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewCouponSimpleComponent } from './new-coupon-simple.component';

describe('NewCouponSimpleComponent', () => {
  let component: NewCouponSimpleComponent;
  let fixture: ComponentFixture<NewCouponSimpleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewCouponSimpleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewCouponSimpleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

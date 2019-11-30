import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewCouponComponent } from './new-coupon.component';
import {TutoComponent} from "../tuto/tuto.component";
import {MatCheckbox, MatFormField, MatIcon, MatProgressBar, MatStep, MatVerticalStepper} from "@angular/material";
import {OldCouponsComponent} from "../old-coupons/old-coupons.component";
import {EmojiModule} from "@ctrl/ngx-emoji-mart/ngx-emoji";
import {TransPipe} from "../trans.pipe";

describe('NewCouponComponent', () => {
  let component: NewCouponComponent;
  let fixture: ComponentFixture<NewCouponComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewCouponComponent,TutoComponent,MatIcon,MatVerticalStepper,MatFormField,OldCouponsComponent,EmojiModule,TransPipe,MatCheckbox,MatStep,MatProgressBar  ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewCouponComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListCouponsComponent } from './list-coupons.component';
import {TimerComponent} from "../timer/timer.component";
import {MatExpansionPanel, MatIcon} from "@angular/material";
import {OrderByPipe} from "../order-by.pipe";
import {PrintCouponComponent} from "../print-coupon/print-coupon.component";
import {ChartsComponent} from "../charts/charts.component";
import {VisualComponent} from "../visual/visual.component";
import {QRCodeComponent} from "angular2-qrcode";
import {TutoComponent} from "../tuto/tuto.component";
import {TruncPipe} from "../trunc.pipe";

describe('ListCouponsComponent', () => {
  let component: ListCouponsComponent;
  let fixture: ComponentFixture<ListCouponsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListCouponsComponent,TimerComponent,MatExpansionPanel,MatIcon,PrintCouponComponent,MatExpansionPanel,ChartsComponent,VisualComponent,QRCodeComponent,TutoComponent],
      providers:[OrderByPipe,TruncPipe]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListCouponsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

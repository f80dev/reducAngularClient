import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintCouponComponent } from './print-coupon.component';
import {VisualComponent} from "../visual/visual.component";
import {QRCodeComponent} from "angular2-qrcode";

describe('PrintCouponComponent', () => {
  let component: PrintCouponComponent;
  let fixture: ComponentFixture<PrintCouponComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrintCouponComponent,VisualComponent,QRCodeComponent]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintCouponComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

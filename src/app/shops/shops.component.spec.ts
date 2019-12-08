import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShopsComponent } from './shops.component';
import {MatCardActions, MatExpansionPanel, MatExpansionPanelHeader, MatIcon} from "@angular/material";
import {VisualComponent} from "../visual/visual.component";
import {PrintCouponComponent} from "../print-coupon/print-coupon.component";
import {ListCouponsComponent} from "../list-coupons/list-coupons.component";
import {TutoComponent} from "../tuto/tuto.component";
import {ScannerComponent} from "../scanner/scanner.component";

describe('ShopsComponent', () => {
  let component: ShopsComponent;
  let fixture: ComponentFixture<ShopsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShopsComponent,MatExpansionPanel,VisualComponent,PrintCouponComponent,
        ListCouponsComponent,TutoComponent,ScannerComponent,MatIcon,MatExpansionPanelHeader,
      MatCardActions]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShopsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

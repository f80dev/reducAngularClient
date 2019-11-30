import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeComponent } from './home.component';
import {FlashscreenComponent} from "../flashscreen/flashscreen.component";
import {
  MatAccordion,
  MatExpansionPanel,
  MatFormField,
  MatIcon, MatOption,
  MatOption,
  MatProgressBar,
  MatSelect
} from "@angular/material";
import {TutoComponent} from "../tuto/tuto.component";
import {UserformComponent} from "../userform/userform.component";
import {ShopsComponent} from "../shops/shops.component";
import {ListCouponsComponent} from "../list-coupons/list-coupons.component";
import {AboutComponent} from "../about/about.component";
import {SafePipe} from "../safe.pipe";
import {VisualComponent} from "../visual/visual.component";
import {QRCodeComponent} from "angular2-qrcode";
import {ScannerComponent} from "../scanner/scanner.component";

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomeComponent,FlashscreenComponent,MatAccordion,
        TutoComponent,UserformComponent,ShopsComponent,ListCouponsComponent,
        AboutComponent,SafePipe,MatIcon,MatProgressBar,MatExpansionPanel,VisualComponent,MatFormField,MatSelect,QRCodeComponent,ScannerComponent,MatOption],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

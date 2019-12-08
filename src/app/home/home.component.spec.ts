import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeComponent } from './home.component';
import {FlashscreenComponent} from "../flashscreen/flashscreen.component";
import {
  MatAccordion,
  MatExpansionPanel,
  MatFormField,
  MatIcon, MatLabel,
  MatOption,
  MatProgressBar, MatProgressSpinner,
  MatSelect
} from "@angular/material";
import {TutoComponent} from "../tuto/tuto.component";
import {UserformComponent} from "../userform/userform.component";
import {ShopsComponent} from "../shops/shops.component";
import {ListCouponsComponent} from "../list-coupons/list-coupons.component";
import {AboutComponent} from "../about/about.component";
import {SafePipe} from "../safe.pipe";
import {VisualComponent} from "../visual/visual.component";
import {ScannerComponent} from "../scanner/scanner.component";
import {PortalModule} from "@angular/cdk/portal";
import {QRCodeComponent} from "angular2-qrcode";
import {TransactionsComponent} from "../transactions/transactions.component";
import {OrderByPipe} from "../order-by.pipe";

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomeComponent,FlashscreenComponent,MatExpansionPanel,MatAccordion,QRCodeComponent,MatProgressSpinner,TransactionsComponent,MatLabel,
        TutoComponent,UserformComponent,ShopsComponent,ListCouponsComponent,MatProgressBar,
        AboutComponent,SafePipe,MatIcon,VisualComponent,MatFormField,MatSelect,ScannerComponent,MatOption
      ],
      imports:[OrderByPipe]
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

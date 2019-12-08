import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserformComponent } from './userform.component';
import {
  MatCardActions,
  MatExpansionPanel,
  MatFormField,
  MatIcon,
  MatOption,
  MatProgressSpinner,
  MatSelect
} from "@angular/material";
import {QRCodeComponent} from "angular2-qrcode";
import {TutoComponent} from "../tuto/tuto.component";
import {VisualComponent} from "../visual/visual.component";
import {TransactionsComponent} from "../transactions/transactions.component";
import {ScannerComponent} from "../scanner/scanner.component";
import {ListCouponsComponent} from "../list-coupons/list-coupons.component";

describe('UserformComponent', () => {
  let component: UserformComponent;
  let fixture: ComponentFixture<UserformComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserformComponent,MatExpansionPanel,MatIcon,QRCodeComponent,
        TutoComponent,MatFormField,VisualComponent,QRCodeComponent,MatProgressSpinner,TransactionsComponent,ScannerComponent,
      MatSelect,MatOption,ListCouponsComponent,MatCardActions]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

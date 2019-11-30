import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserformComponent } from './userform.component';
import {MatExpansionPanel, MatFormField, MatIcon} from "@angular/material";
import {QRCodeComponent} from "angular2-qrcode";
import {TutoComponent} from "../tuto/tuto.component";

describe('UserformComponent', () => {
  let component: UserformComponent;
  let fixture: ComponentFixture<UserformComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserformComponent,MatExpansionPanel,MatIcon,QRCodeComponent,TutoComponent,MatFormField]
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

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NewCouponSimpleComponent } from './new-coupon-simple.component';
import {TutoComponent} from "../tuto/tuto.component";
import {MatFormField, MatIcon, MatVerticalStepper} from "@angular/material";
import {ActivatedRoute, ParamMap, Router} from "@angular/router";
import {MatDialog} from "../../../node_modules/@angular/material/dialog";
import {PromptComponent} from "../prompt/prompt.component";
import {ApiService} from "../api.service";
import {ImageSelectorComponent} from "../image-selector/image-selector.component";

describe('NewCouponSimpleComponent', () => {
  let component: NewCouponSimpleComponent;
  let fixture: ComponentFixture<NewCouponSimpleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewCouponSimpleComponent,TutoComponent,MatIcon,MatVerticalStepper,MatFormField,MatDialog,PromptComponent,ApiService,ImageSelectorComponent,Router,ActivatedRoute]
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

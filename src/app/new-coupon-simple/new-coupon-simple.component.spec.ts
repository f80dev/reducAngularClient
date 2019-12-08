import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NewCouponSimpleComponent } from './new-coupon-simple.component';
import {TutoComponent} from "../tuto/tuto.component";
import {MatDialog, MatDialogRef, MatFormField, MatIcon, MatVerticalStepper} from "@angular/material";
import {ActivatedRoute, Router} from "@angular/router";
import {PromptComponent} from "../prompt/prompt.component";
import {ApiService} from "../api.service";
import {ImageSelectorComponent} from "../image-selector/image-selector.component";

describe('NewCouponSimpleComponent', () => {
  let component: NewCouponSimpleComponent;
  let fixture: ComponentFixture<NewCouponSimpleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewCouponSimpleComponent,TutoComponent,MatIcon,MatVerticalStepper,MatFormField,PromptComponent,ImageSelectorComponent,Router,ActivatedRoute],
      providers: [
        ApiService,
        { provide: MatDialog },
        {provide: MatDialogRef, useValue: {}}
      ]
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

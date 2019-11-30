import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListCouponsComponent } from './list-coupons.component';
import {TimerComponent} from "../timer/timer.component";
import {MatExpansionModule, MatExpansionPanel, MatIcon, MatIconModule} from "@angular/material";

describe('ListCouponsComponent', () => {
  let component: ListCouponsComponent;
  let fixture: ComponentFixture<ListCouponsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListCouponsComponent,TimerComponent,MatExpansionPanel,MatIcon]
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

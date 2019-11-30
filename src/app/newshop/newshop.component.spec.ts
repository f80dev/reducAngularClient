import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewshopComponent } from './newshop.component';
import {VisualComponent} from "../visual/visual.component";
import {TutoComponent} from "../tuto/tuto.component";
import {MatCardContent, MatIcon, MatVerticalStepper} from "@angular/material";

describe('NewshopComponent', () => {
  let component: NewshopComponent;
  let fixture: ComponentFixture<NewshopComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewshopComponent,VisualComponent,TutoComponent,MatIcon,MatVerticalStepper,MatCardContent,NewshopComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewshopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

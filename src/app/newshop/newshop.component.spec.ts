import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewshopComponent } from './newshop.component';
import {VisualComponent} from "../visual/visual.component";
import {TutoComponent} from "../tuto/tuto.component";
import {
  MatCardContent,
  MatCheckbox,
  MatFormField,
  MatIcon, MatOption,
  MatSelect,
  MatToolbar,
  MatVerticalStepper
} from "@angular/material";
import {SafePipe} from "../safe.pipe";

describe('NewshopComponent', () => {
  let component: NewshopComponent;
  let fixture: ComponentFixture<NewshopComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewshopComponent,VisualComponent,TutoComponent,MatIcon,MatVerticalStepper,MatCardContent,NewshopComponent,
      MatToolbar,MatFormField,MatCheckbox,MatSelect,MatOption],
      providers:[SafePipe]
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

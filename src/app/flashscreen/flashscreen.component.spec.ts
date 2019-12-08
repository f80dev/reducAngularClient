import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlashscreenComponent } from './flashscreen.component';
import {SafePipe} from "../safe.pipe";
import {MatExpansionPanel} from "@angular/material";
import {NO_ERRORS_SCHEMA} from "@angular/core";

describe('FlashscreenComponent', () => {
  let component: FlashscreenComponent;
  let fixture: ComponentFixture<FlashscreenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlashscreenComponent,MatExpansionPanel],
      providers:[SafePipe],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlashscreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

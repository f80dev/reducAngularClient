import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlashscreenComponent } from './flashscreen.component';
import {SafePipe} from "../safe.pipe";
import {LocService} from "../loc.service";
import {MatAccordion, MatExpansionModule} from "@angular/material";

describe('FlashscreenComponent', () => {
  let component: FlashscreenComponent;
  let fixture: ComponentFixture<FlashscreenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlashscreenComponent],
      imports:[MatExpansionModule],
      providers:[SafePipe]
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

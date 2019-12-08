import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TutoComponent } from './tuto.component';
import {MatIconModule} from "@angular/material";
import {SafePipe} from "../safe.pipe";
import {ConfigService} from "../config.service";

describe('TutoComponent', () => {
  let component: TutoComponent;
  let fixture: ComponentFixture<TutoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TutoComponent,SafePipe,TutoComponent],
      imports:[MatIconModule],
      providers:[ConfigService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TutoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

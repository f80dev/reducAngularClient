import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PromptComponent } from './prompt.component';

import {SafePipe} from "../safe.pipe";
import {MatFormField,  MatIcon} from "@angular/material";
import {EmojiComponent} from "@ctrl/ngx-emoji-mart/ngx-emoji";
import {MatDialog} from "../../../node_modules/@angular/material/dialog";

describe('PromptComponent', () => {
  let component: PromptComponent;
  let fixture: ComponentFixture<PromptComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PromptComponent,MatFormField,EmojiComponent,MatIcon ],
      providers: [SafePipe,{ provide: MatDialog }]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PromptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

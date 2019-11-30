import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageSelectorComponent } from './image-selector.component';
import {MatIcon} from "@angular/material";

describe('ImageSelectorComponent', () => {
  let component: ImageSelectorComponent;
  let fixture: ComponentFixture<ImageSelectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImageSelectorComponent,MatDialog, PromptComponent,MatSnackBar,MatIcon]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImageSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

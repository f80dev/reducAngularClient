import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageSelectorComponent } from './image-selector.component';
import {MatDialogActions, MatGridList, MatIcon, MatSnackBar, MatSnackBarModule} from "@angular/material";
import {PromptComponent} from "../prompt/prompt.component";
import {MatDialog} from "../../../node_modules/@angular/material/dialog";
import {EmojiComponent} from "@ctrl/ngx-emoji-mart/ngx-emoji";
import {VisualComponent} from "../visual/visual.component";

describe('ImageSelectorComponent', () => {
  let component: ImageSelectorComponent;
  let fixture: ComponentFixture<ImageSelectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImageSelectorComponent, PromptComponent,MatIcon,EmojiComponent,MatGridList,VisualComponent,MatDialogActions],
      imports:[MatSnackBarModule],
      providers: [
        { provide: MatDialog }
      ]
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

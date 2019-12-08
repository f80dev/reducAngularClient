import { TestBed, async } from '@angular/core/testing';
import { AppComponent } from './app.component';
import {TutoComponent} from "./tuto/tuto.component";
import {RouterTestingModule} from "@angular/router/testing";
import {MatIcon} from "@angular/material";
import {SafePipe} from "./safe.pipe";
import {OrderByPipe} from "./order-by.pipe";

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent,TutoComponent,MatIcon
      ],
      providers:[OrderByPipe],
      imports:[RouterTestingModule]
    }).compileComponents();
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'reducClient'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app.title).toEqual('reducClient');
  });

  it('should render title', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('.content span').textContent).toContain('reducClient app is running!');
  });
});

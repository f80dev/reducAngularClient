import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowcodeComponent } from './showcode.component';

describe('ShowcodeComponent', () => {
  let component: ShowcodeComponent;
  let fixture: ComponentFixture<ShowcodeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShowcodeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowcodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

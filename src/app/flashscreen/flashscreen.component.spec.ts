import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlashscreenComponent } from './flashscreen.component';

describe('FlashscreenComponent', () => {
  let component: FlashscreenComponent;
  let fixture: ComponentFixture<FlashscreenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlashscreenComponent ]
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

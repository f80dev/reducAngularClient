import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewshopComponent } from './newshop.component';

describe('NewshopComponent', () => {
  let component: NewshopComponent;
  let fixture: ComponentFixture<NewshopComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewshopComponent ]
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

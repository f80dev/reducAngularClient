import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransacshopComponent } from './transacshop.component';

describe('TransacshopComponent', () => {
  let component: TransacshopComponent;
  let fixture: ComponentFixture<TransacshopComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransacshopComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransacshopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

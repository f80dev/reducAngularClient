import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OldCouponsComponent } from './old-coupons.component';

describe('OldCouponsComponent', () => {
  let component: OldCouponsComponent;
  let fixture: ComponentFixture<OldCouponsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OldCouponsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OldCouponsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

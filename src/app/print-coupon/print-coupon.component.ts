import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-print-coupon',
  templateUrl: './print-coupon.component.html',
  styleUrls: ['./print-coupon.component.css']
})
export class PrintCouponComponent implements OnInit {

  constructor() { }

  @Input("coupon") coupon:any=null;
  @Input("shop") shop:any=null;

  ngOnInit() {
  }

}

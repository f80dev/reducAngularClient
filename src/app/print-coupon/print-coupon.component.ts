import {Component, Input, OnInit} from '@angular/core';
import {ConfigService} from "../config.service";

@Component({
  selector: 'app-print-coupon',
  templateUrl: './print-coupon.component.html',
  styleUrls: ['./print-coupon.component.css']
})
export class PrintCouponComponent implements OnInit {

  constructor(public config:ConfigService) { }

  @Input("coupon") coupon:any=null;
  @Input("shop") shop:any=null;

  ngOnInit() {
  }

}

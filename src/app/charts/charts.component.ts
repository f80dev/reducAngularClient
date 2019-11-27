import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ApiService} from "../api.service";

@Component({
  selector: 'app-charts',
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.css']
})
export class ChartsComponent implements OnInit {

  users:any[]=[];
  @Input("coupon") coupon:any={};
  @Output("close") onclose:EventEmitter<any>=new EventEmitter();

  constructor(public api:ApiService) { }

  ngOnInit() {
    this.api.getUsersFromCoupon(this.coupon,8).subscribe((r:any)=>{
      this.users=r;
    })
  }

}

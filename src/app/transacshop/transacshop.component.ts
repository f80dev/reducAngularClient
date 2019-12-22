import { Component, OnInit } from '@angular/core';
import {MatDialog} from "../../../node_modules/@angular/material/dialog";
import {ConfigService} from "../config.service";
import {ApiService} from "../api.service";
import {ActivatedRoute, ParamMap, Router} from "@angular/router";
import {Location} from "@angular/common";
import {Socket} from "ngx-socket-io";
import {hashCode} from "../tools";

@Component({
  selector: 'app-transacshop',
  templateUrl: './transacshop.component.html',
  styleUrls: ['./transacshop.component.css']
})
export class TransacshopComponent implements OnInit {

  shopid="";
  userid="";
  coupons:any[]=[];
  shopname="";
  size="4vmin";

  constructor(public config:ConfigService,
              public api: ApiService,
              public socket:Socket,
              public route: ActivatedRoute,
              public router:Router,
              public location: Location) {

  }

  ngOnInit() {
    var params:ParamMap=this.route.snapshot.queryParamMap;
    this.userid=params.get("userid");
    this.shopid=params.get("shopid");
    this.shopname=params.get("shopname") || "";
    this.refresh();

    this.socket.on("refresh",(data:any)=> {
      if (data.user == this.userid) {
        this.refresh();
      }
    });
  }

  refresh(){
    this.api.getuser(this.userid).subscribe((u:any)=>{
      this.coupons=[];
      if(u.coupon_to_validate){
        for(let c of u.coupon_to_validate){
          if(c.shop==this.shopid){
            this.coupons.push(c);
          }
        }
      }
    })
  }

  use(coupon:any){
    this.api.use(coupon).subscribe((result:any)=>{});
  }

  cancel(coupon:any){
    this.api.ask(coupon,false).subscribe((result:any)=>{});
  }

  hashId(s:string){
    return Math.abs(hashCode(s)).toString(16).toUpperCase();
  }
}

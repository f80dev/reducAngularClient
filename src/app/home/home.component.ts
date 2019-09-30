import { Component, OnInit } from '@angular/core';
import {ApiService} from '../api.service';
import {ActivatedRoute, Router} from '@angular/router';
import {checkLogin} from '../tools';
import {Socket} from "ngx-socket-io";
import {Location} from '@angular/common'
import {ConfigService} from "../config.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(public socket:Socket,
              public api: ApiService,
              public router: Router,
              public config:ConfigService,
              public _location:Location,
              public route: ActivatedRoute) { }

  showMessage: boolean=false;
  user: any = {message:""};
  coupons=[];

  ngOnInit() {
    this.refresh(this.route.snapshot.queryParamMap.get("message"));
    this._location.replaceState("/home");
    this.socket.on("refresh",(data:any)=>{
      if(data.user==this.user._id){
        this.refresh(data.message);
      }
    });
  }

  refresh(message="") {
    if(message==null)message="";
    if (checkLogin(this.router, this.route.snapshot.queryParamMap)) {
      this.api.getuser(localStorage.getItem('user')).subscribe((u) => {
        this.user = u;
        this.user.message=message;
        if(this.user.message.startsWith("#"))this.user.message=this.user.message.substr(1);
        if(message.startsWith("#"))this.showMessage=true;


        //Effacer le message
        setTimeout(()=>{this.user.message=""},15000);

        if(this.user.coupons!=null){
          this.coupons=[];
          var i=0;
          this.user.coupons.forEach((coupon)=>{
            if(coupon.origin!=coupon._id){
              if(i==0)coupon.visible=true;
              this.coupons.push(coupon);
              i++;
            }
          });
        }
      });
    }
  }

  closeFlashScreen() {
    this.showMessage=false;
  }
}

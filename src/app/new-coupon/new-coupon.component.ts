import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ApiService} from '../api.service';
import {cropToSquare, resizeBase64Img, selectFile} from "../tools";
import {ActivatedRoute} from "@angular/router";
import { Location } from '@angular/common';

@Component({
  selector: 'app-new-coupon',
  templateUrl: './new-coupon.component.html',
  styleUrls: ['./new-coupon.component.css']
})
export class NewCouponComponent implements OnInit {
  coupon: any = {
    title:"Mon titre",
    shop: 'test',
    symbol:"min",
    label: 'Super promo !',
    breakable:false,
    unity: 'minute',
    delay:0,
    pluriel:true,
    conditions:"La promotion n'est valable que pour un achat d'un montant supérieur à ",
    share_bonus: 3,
    direct_bonus: 5,
    pay_bonus: 10,
    max: 60,
    stock:60,
    max_coupon:1000,
    duration_jours: 2.0,
    duration_hours: 0.0,
    picture: 'https://img.bonne-promo.com/image/reduction.png'
  };

  showIcons=false;
  showOldCoupon=false;
  icons=[];

  @Input("shop") shop:any={};
  shopNameEdit = true;
  @Output('insert') oninsert: EventEmitter<any>=new EventEmitter();
  @Output('close') onclose: EventEmitter<any>=new EventEmitter();
  preview: string="";

  constructor(public api: ApiService,public route: ActivatedRoute,public location: Location) { }

  ngOnInit() {
    this.shopNameEdit = false;
    this.coupon.shop = this.shop._id;
  }

  addIcons(){
    var root="https://shifumix.com/avatars/";
    if(this.icons.length==0){
      for(var i=1;i<300;i++)
        this.icons.push({photo:root+"file_emojis"+i+".png"});
    }
  }

  addcoupon(coupon: any) {
    //Mise en conformité du coupon
    if(coupon.duration_jours==null)coupon.duration_jours=0;
    if(coupon.duration_hours==null)coupon.duration_hours=0;
    coupon.durationInSec=coupon.duration_jours*24*3600+coupon.duration_hours*3600;
    coupon.delay=0;

    if(coupon.pluriel && coupon.unity.endsWith("s"))coupon.unity=coupon.unity.substr(0,coupon.unity.length-1);
    coupon.unity=coupon.unity.toLowerCase();

    this.api.addCoupon(coupon).subscribe((result: any) => {
      this.oninsert.emit({message:result.message});
    });
  }

  refreshPicture() {
    this.preview=this.coupon.picture;
  }

  onSelectFile(event:any) {
    selectFile(event,600,(res)=>{
      this.coupon.picture=res;
      this.preview=res;
    })
  }

  selIcon(icon: any) {
    this.showIcons=false;
    this.coupon.picture=icon.photo;
    this.preview=icon.photo;
  }

  selectOldAsModel(coupon: any) {
    coupon.shop=this.coupon.shop;
    this.coupon=coupon;
    this.coupon.dtStart=new Date().getTime();
    this.coupon.duration_hours=Math.trunc(coupon.duration);
    this.preview=coupon.picture;
    this.showOldCoupon=false;
  }
}

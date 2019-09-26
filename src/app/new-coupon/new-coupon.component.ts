import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ApiService} from '../api.service';
import {cropToSquare, resizeBase64Img} from "../tools";
import {ActivatedRoute} from "@angular/router";
import { Location } from '@angular/common';

@Component({
  selector: 'app-new-coupon',
  templateUrl: './new-coupon.component.html',
  styleUrls: ['./new-coupon.component.css']
})
export class NewCouponComponent implements OnInit {
  coupon: any = {
    shop: 'test',
    label: 'Super promo !',
    breakable:false,
    unity: 'minute',
    pluriel:true,
    conditions:"La promotion n'est valable que pour un achat d'un montant supérieur à ",
    share_bonus: 3,
    direct_bonus: 5,
    pay_bonus: 10,
    max: 60,
    stock:60,
    max_coupon:1000,
    duration_jours: 2,
    duration_hours: 0,
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
    coupon.duration=(coupon.duration_jours*24+coupon.duration_hours)/24;
    this.api.addCoupon(coupon).subscribe((result: any) => {
      this.oninsert.emit({message:result.message});
    });
  }

  refreshPicture() {
    this.preview=this.coupon.picture;
  }

  onSelectFile(event:any) {
    if(event.target.files && event.target.files.length > 0) {
      var reader = new FileReader();
      reader.onload = ()=>{
        var dataURL = reader.result;
        resizeBase64Img(dataURL,800,0.5,(result=>{
          cropToSquare(result,0.5,(result_square)=>{
            this.coupon.picture=result_square;
            this.preview=result_square;
          })
        }))

      };
      reader.readAsDataURL(event.target.files[0]);
    }
  }

  selIcon(icon: any) {
    this.showIcons=false;
    this.coupon.picture=icon.photo;
    this.preview=icon.photo;
  }

  selectOldAsModel(coupon: any) {
    this.coupon=coupon;
    this.coupon.dtStart=new Date().getTime();
    this.coupon.duration_hours=Math.trunc(coupon.duration);
    this.preview=coupon.picture;
    this.showOldCoupon=false;
  }
}

import {Component, EventEmitter, Inject, Input, OnInit, Output} from '@angular/core';
import {ApiService} from '../api.service';
import {
  buildTeaser,
  checkLogin,
  compute, evalTitle,
  showError,
  unique_id
} from "../tools";
import {ActivatedRoute, ParamMap, QueryParamsHandling} from "@angular/router";
import { Location } from '@angular/common';
import {ConfigService} from "../config.service";
import {MatDialog} from "../../../node_modules/@angular/material/dialog";

import { Router} from '@angular/router';
import {ImageSelectorComponent} from "../image-selector/image-selector.component";

export interface DialogDataCoupon {
  coupon: any;
  title: string;
}

@Component({
  selector: 'app-new-coupon',
  templateUrl: './new-coupon.component.html',
  styleUrls: ['./new-coupon.component.css']
})

export class NewCouponComponent implements OnInit {
  coupon: any = {
    title:"",
    device:unique_id(),
    shop: 'test',
    symbol:"min",
    label: 'Super promo !',
    breakable:false,
    unity: 'minute',
    delay:0,
    nb_partage:100,
    final_bonus:0,
    pluriel:true,
    min_price:0,  //prix minimum pour la promotion
    conditions:"pour un achat d'un montant supérieur à 15€",
    share_bonus: 3,
    direct_bonus: 5,
    pay_bonus: 10,
    max: 60,
    stock:60,
    website:"https://reducshare.com/faq.html#coupon",
    max_coupon:1000,
    duration_jours: 2.0,
    duration_hours: 0.0,
    picture: 'https://img.bonne-promo.com/image/reduction.png',
    promocodes:'PROMOCODE1=3,PROMOCODE2=5,PROMOCODE3=8'
  };

  saveMax=0;
  shopname="";
  shopaddress="";
  showOldCoupon=false;
  level=0;

  @Output('insert') oninsert: EventEmitter<any>=new EventEmitter();
  @Output('close') onclose: EventEmitter<any>=new EventEmitter();
  tags:string="";
  userid:string="";
  hasMax: boolean = true;
  focusElt="";

  constructor(public dialog:MatDialog,
              public config:ConfigService,
              public api: ApiService,
              public route: ActivatedRoute,
              public router:Router,
              public location: Location) {
  }


  /**
   *
   */
  ngOnInit() {
    checkLogin(this.router);

    var params:ParamMap=this.route.snapshot.queryParamMap;
    if(params.has("shopid"))this.coupon.shop = params.get("shopid");
    if(params.has("couponid")){
      this.coupon=this.api.coupon;

      if(this.coupon.share_bonus>0)this.coupon.nb_partage=1/this.coupon.share_bonus;
      var hrs=Math.trunc((this.coupon.dtEnd-this.coupon.dtStart)/3600);
      this.coupon.duration_jours=Math.trunc(hrs/24);
      this.coupon.duration_hours=hrs-this.coupon.duration_jours*24;

      this.coupon=compute(this.api.coupon);
    }
    this.userid=params.get("userid") || "";
    this.level=Number(params.get("level") || "0");
    this.tags=params.get("tags") || "";

    this.shopname=params.get("shopname") || "";
    this.shopaddress=params.get("shopaddress") || "";

    var modele=params.get("modele") || "";
    if(modele.length>0){
      this.config.values.modeles.forEach((m)=>{
        if(m.id==modele){
          this.selectOldAsModel(m);
        }
      })
    } else {
      // if(params.get("edit")!="true"){
      //   this.showOldCoupon=true;
      // }
    }
  }


  normalize_conditions(coupon){
    //Traitement des conditions pour coller au texte
    coupon=compute(coupon);
    this.refresh();
  }


  /**
   *
   * @param coupon
   */
  addcoupon(coupon: any) {
    //Mise en conformité du coupon

    coupon=compute(coupon);

    this.api.addCoupon(coupon).subscribe((result: any) => {
      localStorage.setItem("showCoupon",result._id);
      this.oninsert.emit({message:result.message});
      this.router.navigate(['home'],{queryParams:{message:result.message}});
    },(error)=>{showError(this,error);});
  }

  /**
   *
   * @param coupon
   */
  selectOldAsModel(coupon: any) {
    if(coupon.share_bonus>0)coupon.nb_partage=1/coupon.share_bonus;
    coupon.shop=this.coupon.shop;

    if(coupon.duration!=null)coupon["duration_hours"]=Math.trunc(coupon.duration/3600);
    if(coupon.duration_jours==null)coupon["duration_jours"]=0;
    if(coupon.duration_hours==null)coupon["duration_hours"]=0;
    if(coupon.duration==null)coupon.duration=(coupon.duration_jours*24+coupon.duration_hours)*3600;
    if(coupon.duration<=0)coupon.duration=3600;

    coupon.duration_jours=Math.trunc(coupon.duration/(24*3600));
    if(coupon.duration_jours>0)coupon.duration_hours=coupon.duration-coupon.duration_jours*(24*3600);

    this.coupon=compute(coupon);

    this.showOldCoupon=false;

    this.refresh();
  }

  cancel(){
    this.router.navigate(['home'],{queryParams:{message:"création de coupon annulée"}});
  }



  refresh(){
    this.hasMax=(this.coupon.max>0);
    this.coupon.title=evalTitle(this.coupon);
    if(this.coupon.max>0)this.coupon.title=this.coupon.title+" jusqu'a "+this.coupon.max+this.coupon.symbol;
  }

  changeMax() {
    if(!this.hasMax){
      this.saveMax=this.coupon.max;
      this.coupon.max=0;
    }
    else
      this.coupon.max=this.saveMax;
  }

  buildCouponTeaser(coupon: any, shopname: string) {
    return buildTeaser(coupon,shopname);
  }

  addImage(field,width,height,emoji=false) {
    this.dialog.open(ImageSelectorComponent, {width: '90%',height:"70%", data: {emoji:emoji,result:this.coupon[field],width: width,height:height}}).afterClosed().subscribe((result) => {
      if(result){
        this.coupon[field]=result;
      }
    });
  }
}

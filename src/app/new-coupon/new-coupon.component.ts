import {Component, EventEmitter, Inject, Input, OnInit, Output} from '@angular/core';
import {ApiService} from '../api.service';
import {checkLogin, cropToSquare, resizeBase64Img, selectFile, showError, unique_id} from "../tools";
import {ActivatedRoute, ParamMap, QueryParamsHandling} from "@angular/router";
import { Location } from '@angular/common';
import {ConfigService} from "../config.service";
import {DialogData, PromptComponent} from "../prompt/prompt.component";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "../../../node_modules/@angular/material/dialog";
import { DeviceDetectorService } from 'ngx-device-detector';
import { Router} from '@angular/router';

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
    pluriel:true,
    min_price:0,  //prix minimum pour la promotion
    conditions:"un achat d'un montant supérieur à 15€",
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
  title="";
  showOldCoupon=false;
  icons=[];

  //@Input("shop") shop:any={};
  //@Input("level") level=0;

  //mode="add";

  @Output('insert') oninsert: EventEmitter<any>=new EventEmitter();
  @Output('close') onclose: EventEmitter<any>=new EventEmitter();
  preview: string="";
  tags:string="";
  userid:string="";

  constructor(public dialog:MatDialog,
              public config:ConfigService,
              public api: ApiService,
              public deviceService: DeviceDetectorService,
              public route: ActivatedRoute,
              public router:Router,
              public location: Location) { }

  ngOnInit() {
    checkLogin(this.router);
    var params:ParamMap=this.route.snapshot.queryParamMap;
    if(params.has("shopid"))this.coupon.shop = params.get("shopid");
    if(params.has("couponid")){
      this.coupon=this.api.coupon;
      this.preview=this.api.coupon.picture;
      var hrs=Math.trunc((this.coupon.dtEnd-this.coupon.dtStart)/3600);
      this.coupon.duration_jours=Math.trunc(hrs/24);
      this.coupon.duration_hours=hrs-this.coupon.duration_jours*24;
    }
    this.userid=params.get("user") || "";
    this.title=params.get("title") || "";
    this.tags=params.get("tags") || "";
  }

  addIcons(){
    var root="https://shifumix.com/avatars/";
    if(this.icons.length==0){
      for(var i=1;i<300;i++)
        this.icons.push({photo:root+"file_emojis"+i+".png"});
    }
  }

  normalize_conditions(coupon){
    //Traitement des conditions pour coller au texte
    if(coupon.conditions.startsWith("pour "))coupon.conditions=coupon.conditions.substr(5);
    coupon.conditions=coupon.conditions.replace("offre valable pour","").replace("valable pour","");
  }

  addcoupon(coupon: any) {
    //Mise en conformité du coupon
    if(coupon.duration_jours==null)coupon.duration_jours=0;
    if(coupon.duration_hours==null)coupon.duration_hours=0;
    coupon.durationInSec=coupon.duration_jours*24*3600+coupon.duration_hours*3600;
    coupon.delay=0;
    coupon.owner=this.userid;

    if(coupon.pluriel && coupon.unity.endsWith("s"))coupon.unity=coupon.unity.substr(0,coupon.unity.length-1);
    coupon.unity=coupon.unity.toLowerCase();

    this.config.waiting=true;
    this.api.addCoupon(coupon).subscribe((result: any) => {
      this.config.waiting=false;
      localStorage.setItem("showCoupon",result._id);
      this.oninsert.emit({message:result.message});
      this.router.navigate(['home'],{queryParams:{message:result.message}});
    },(error)=>{showError(this,error);});
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

  cancel(){
    this.router.navigate(['home'],{queryParams:{message:"création de coupon annulée"}});
  }

  addEmoji() {
    this.dialog.open(PromptComponent,{width: '250px',data: {title: "Utiliser un emoji", question: ""}
    }).afterClosed().subscribe((result) => {
      if(result){
        this.coupon.picture=result;
        this.preview=result;
      }
    });
  }
}

import {Component, EventEmitter, Inject, Input, OnInit, Output} from '@angular/core';
import {ApiService} from '../api.service';
import {buildTeaser, checkLogin, cropToSquare, resizeBase64Img, selectFile, showError, unique_id} from "../tools";
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
    max_coupon:1000,
    duration_jours: 2.0,
    duration_hours: 0.0,
    picture: 'https://img.bonne-promo.com/image/reduction.png'
  };

  saveMax=0;

  showIcons=false;
  shopname="";
  showOldCoupon=false;
  icons=[];

  level=0;

  //mode="add";

  @Output('insert') oninsert: EventEmitter<any>=new EventEmitter();
  @Output('close') onclose: EventEmitter<any>=new EventEmitter();
  preview: string="";
  tags:string="";
  userid:string="";
  hasMax: boolean = true;
  focusElt="";

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
    this.userid=params.get("userid") || "";
    this.level=Number(params.get("level") || "0");
    this.shopname=params.get("shopname") || "";
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
    if(!coupon.conditions.startsWith("pour ") && !coupon.conditions.startsWith("sur "))coupon.conditions="pour "+coupon.conditions;
    coupon.conditions=coupon.conditions.replace("offre valable pour","").replace("valable pour","");
    this.refresh();
  }

  addcoupon(coupon: any) {
    //Mise en conformité du coupon
    if(coupon.duration_jours==null)coupon.duration_jours=0;
    if(coupon.duration_hours==null)coupon.duration_hours=0;
    coupon.durationInSec=coupon.duration_jours*24*3600+coupon.duration_hours*3600;
    coupon.delay=0;
    coupon.owner=this.userid;

    if(coupon.nb_partage==0)
      coupon.share_bonus=0;
    else
      coupon.share_bonus=1/coupon.nb_partage;

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

    if(coupon.duration!=null)coupon["duration_hours"]=Math.trunc(coupon.duration/3600);
    if(coupon.duration_jours==null)coupon["duration_jours"]=0;
    if(coupon.duration_hours==null)coupon["duration_hours"]=0;
    if(coupon.duration==null)coupon.duration=(coupon.duration_jours*24+coupon.duration_hours)*3600;
    if(coupon.duration<=0)coupon.duration=3600;

    coupon.duration_jours=Math.trunc(coupon.duration/(24*3600));
    if(coupon.duration_jours>0)coupon.duration_hours=coupon.duration-coupon.duration_jours*(24*3600);

    this.coupon=coupon;
    this.coupon.nb_partage=Math.round(1/coupon.share_bonus);
    this.coupon.dtStart=new Date().getTime();
    this.preview=coupon.picture;
    this.showOldCoupon=false;

    this.refresh();
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

  refresh(){
    this.hasMax=(this.coupon.max>0);
    this.coupon.title=this.coupon.label;
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
}

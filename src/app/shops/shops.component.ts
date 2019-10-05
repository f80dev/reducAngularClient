import {
  AfterContentInit,
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output
} from '@angular/core';
import {Router} from '@angular/router';
import {ApiService} from "../api.service";
import {MatDialog, MatSnackBar} from "@angular/material";
import {NewCouponComponent} from "../new-coupon/new-coupon.component";
import {sendToPrint, showError} from "../tools";
import {PromptComponent} from "../prompt/prompt.component";
import {ConfigService} from "../config.service";


@Component({
  selector: 'app-shops',
  templateUrl: './shops.component.html',
  styleUrls: ['./shops.component.css']
})
export class ShopsComponent implements OnChanges {
  @Input('user') user:any={};

  @Output('delete') ondelete: EventEmitter<any>=new EventEmitter();
  @Output('insert') oninsert: EventEmitter<any>=new EventEmitter();
  @Output('update') onupdate: EventEmitter<any>=new EventEmitter();

  coupons=[];
  showWebCam=false;

  constructor(public snackBar: MatSnackBar,
              public router: Router,
              public config:ConfigService,
              public dialog:MatDialog,
              public api:ApiService) {}


  ngOnChanges(){
    this.refresh(0);
  }

  /**
   *
   * @param showItem
   */
  refresh(showItem=-1){
    if(this.user!=null && this.user.coupons!=null){
      this.coupons=[];
      var i=0;
      this.user.coupons.forEach((coupon)=>{
        coupon.visible=false;
        if(i==showItem)coupon.visible=true;
        if(coupon.origin==coupon._id){
          this.coupons.push(coupon);
          i++;
        }
      });
    }

  }


  onInsert(){
    //shop.showAddCoupon=false;
    this.oninsert.emit('coupon ajouté');
    this.refresh(0);
  }

  delShop(shop: any) {
    this.api.removeShop(shop._id).subscribe((result)=>{
      this.ondelete.emit(result);
    },(error)=>{showError(this,error);});
  }

  openPrinter(shop:any){
    sendToPrint("print-section-"+shop._id);
  }

  edit(shop:any,coupon:any){
    this.api.shop=shop;
    this.api.coupon=coupon;
    this.api.user=this.user;
    this.router.navigate(["new_coupon"],{queryParams:{couponid:coupon._id,title:"Editer "+coupon.title,userid:this.user._id}});
  }

  addCoupon(shop: any) {
    this.api.shop=shop;
    this.api.user=this.user;
    this.router.navigate(["new_coupon"],{queryParams:{shopid:shop._id,title:"Promotion pour "+shop.name,tags:shop.tags,userid:this.user._id}});
  }


  setDelegate(shop:any) {
    if(this.config.webcamsAvailable==0){
      this.dialog.open(PromptComponent, {width: '250px',data: {title: "Code utilisateur", question:"", onlyConfirm: false}
      }).afterClosed().subscribe((result) => {
        if(result!=null && result.length>0)
          this.api.delegate(result,shop._id).subscribe(()=>{},(error)=>{showError(this,error);});
      });
    } else {
      this.showWebCam=!this.showWebCam;
    }

  }

  onFlash_event(decoded: any,shop:any) {
    if(decoded!=null){
      var result=decoded.data;
      if(result!=null && result.length>0){
        this.user.message="Utilisateur ajouté comme délégataire";
        this.api.delegate(result,shop._id).subscribe(()=>{
          this.showWebCam=false;
        },(error)=>{showError(this,error);});
      }
    }
  }
}

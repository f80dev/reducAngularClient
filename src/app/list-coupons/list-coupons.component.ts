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
import {ClipboardService} from 'ngx-clipboard';
import {ApiService} from '../api.service';
import {environment} from '../../environments/environment';
import {Router} from '@angular/router';
import {SocialService} from "ngx-social-button"
import { Meta } from '@angular/platform-browser';
import { NgNavigatorShareService } from 'ng-navigator-share';
import {PromptComponent} from "../prompt/prompt.component";
import {MatDialog} from "../../../node_modules/@angular/material/dialog";
import {isLocal, sendToPrint, showError, showMessage, traitement_coupon} from "../tools";
import {ConfigService} from "../config.service";
import {MatSnackBar} from "@angular/material";

@Component({
  selector: 'app-list-coupons',
  templateUrl: './list-coupons.component.html',
  styleUrls: ['./list-coupons.component.css']
})
export class ListCouponsComponent implements OnChanges {

  // tslint:disable-next-line:no-input-rename
  @Input('coupons') coupons: any[] = [];
  @Input('user') user: any;
  @Input('title') title="";
  @Input('sort') sort="dtCreate";

  @Output('delete') ondelete: EventEmitter<any>=new EventEmitter();
  @Output('update') onupdate: EventEmitter<any>=new EventEmitter();
  @Output('flash') onflash: EventEmitter<any>=new EventEmitter();
  @Output('edit') onedit: EventEmitter<any>=new EventEmitter();

  flipDiv=true;
  showChart=false;
  formatDate='dd/MM HH:mm';

  constructor(public meta: Meta,
              public snackBar: MatSnackBar,
              private _clipboardService: ClipboardService,
              public api: ApiService,public dialog: MatDialog,
              public router: Router,private socialAuthService: SocialService,
              public config:ConfigService,
              public ngNavigatorShareService: NgNavigatorShareService) {
  }

  ngOnChanges() {
    this.coupons=traitement_coupon(this.coupons,localStorage.getItem("showCoupon"));
  }

  fixTagPage(coupon:any){
    this.meta.removeTag('name = "og:url"');
    this.meta.removeTag('name = "og:type"');
    this.meta.removeTag('name = "og:title"');
    this.meta.removeTag('name = "og:description"');
    this.meta.removeTag('name = "og:image"');

    this.meta.addTags([
      {name:"og:url",content:coupon.url},
      {name:"og:type",content:"website"},
      {name:"og:locale",content:"fr_FR"},
      {name:"og:title",content:coupon.label},
      {name:"og:description",content:"Ouvrir pour profiter vous aussi de la promotion"},
      {name:"og:image",content:coupon.picture}
    ],true);
  }

  showCode(coupon: any,mode=1) {
    if(coupon.visible==mode)mode=0;
    coupon.visible=mode;
    if(coupon.visible==3)coupon.visible=1;

    coupon.qrcode = environment.domain_appli + '/getqrcode/' + coupon._id;

    if(mode==3){
      coupon.url=coupon.url + "?gift";
      coupon.qrcode=coupon.qrcode+"?gift";
    } //On offre ses points et l'on pert le coupon
    if(mode==1 || mode==3){
      this.fixTagPage(coupon);
      this.ngNavigatorShareService.share({
        title: coupon.label,
        text: coupon.message+". Ouvrir le lien pour en bénéficier",
        url: coupon.url
      }).then( (response) => {
        console.log(response);
      })
        .catch( (error) => {
          if(isLocal())
            this._clipboardService.copyFromContent(coupon.url)
          else
            this._clipboardService.copyFromContent(coupon.message+". Pour en bénéficier, ouvrir "+coupon.url);

          showMessage(this,"Invitation dans le presse-papier, prête à être envoyée via SMS, mail, WhatsApp, Instagram, etc ...",);
        });
    }

    if(mode==2){//Mode utilisation
      this._clipboardService.copyFromContent(coupon.url); //En mode local on copie le lien dans le presse papier
      var dtEnd=new Date(Number(coupon.dtEnd)*1000);
      var dtNow=new Date();
      if(dtEnd.getDay()==dtNow.getDay() && dtEnd.getMonth()==dtNow.getMonth())
        this.formatDate="HH:mm";
      else{
        if(dtEnd.getMonth()==dtNow.getMonth())
          this.formatDate="dd";
        else
          this.formatDate="dd/MM";
      }
    }
  }

  share(url) {
  }

  showInfos(coupon: any) {
    if(coupon.showInfos==null)coupon.showInfos=false;
    coupon.showInfos = !coupon.showInfos;
  }

  showAddress(shop: any) {
    window.open("https://www.google.com/maps/dir/?api=1&destination="+shop.lat+","+shop.lng+"&travelmode=recommended")
    //window.open('https://www.google.fr/maps/place/' + shop.address);
  }

  remove(coupon: any) {
    var question="Etes vous bien sur ?";
    if(coupon.origin!=coupon._id)
      question="Vraiment ? Pourtant vous avez une réduction de "+coupon.gain+coupon.symbol+" à cet endroit";
    else {
      if(coupon.share>0)
        question="Vraiment ? Supprimer une réduction, déjà récupérée va nuire à votre réputation de vendeur."
    }

    if(coupon.gain>0){
      this.dialog.open(PromptComponent,{width: '250px',data: {onlyConfirm:true,title: "Supprimer une réduction ?", question: question}
      }).afterClosed().subscribe((result) => {
        if(result=="yes"){
          this.api.removeCoupon( coupon._id).subscribe(() => {
            this.ondelete.emit();
          });
        }
      });
    } else {
      this.api.removeCoupon( coupon._id).subscribe(() => {
        this.ondelete.emit();
      });
    }


  }

  openPrinter(coupon: any) {
    sendToPrint("print-section-"+coupon._id);
  }

  socialSharing(coupon: any) {
    this.socialAuthService.facebookSharing({href:coupon.url,hashtag:coupon.label});
  }

  stopDeal(coupon: any) {
    this.api.stopdeal(coupon["_id"]).subscribe((mes:any)=>{
      this.onupdate.emit(mes);
    });
  }

  isfollower(shopid: string){
    var bc=false;
    if(this.user.follow!=null){
      this.user.follow.forEach(item => {
        if(item.shop_id==shopid)bc=true;
      })
    }
    return bc;
  }

  addfollow(userid: string, shopid: string) {
    var operation="+";
    if(this.isfollower(shopid))operation="-";

    this.api.follow(userid,operation,shopid).subscribe((r:any)=>{
      this.user.message=r.message;
      this.onupdate.emit({"message":r.message});
    });
  }

  showCoupon(coupon: any,mode=false) {
    if(mode)
      localStorage.setItem("showCoupon",coupon._id);
    else
      localStorage.setItem("showCoupon",null);
  }

  isVisible(coupon:any){
    var couponToShow=localStorage.getItem("showCoupon");
    if(couponToShow==coupon._id && (coupon["flip"] || coupon._id==coupon.origin))return true;
    return false;
  }

  flash(coupon:any){
    this.api.flash(this.user._id, coupon._id).subscribe((result:any) => {
      localStorage.setItem("showCoupon",result.newcoupon);
      this.user.message = result.message;
      this.onflash.emit({message:result.message});
    },(error)=>{showError(this,error);});
  }

  openHelp(url:string){
    if(url!=null)
      window.open(url,"_blank");
  }

  updateStock(coupon) {
    this.dialog.open(PromptComponent,{width: '250px',data: {title: "Stock ?"}
    }).afterClosed().subscribe((result) => {
      if(result){
        if(result.indexOf(".")==-1)result=result+".0";
        this.api.updateCoupon(coupon["origin"],"stock",result).subscribe((res)=>{
          this.onupdate.emit({"message":"stock mise a jour"});
        });
      }
    });
  }

  _flip(coupon) {
    coupon['flip']=!coupon['flip'];
    if(coupon['flip']){
      this.config.flips.push(coupon._id);
      coupon.visible=0; //share mode
      localStorage.setItem("showCoupon",coupon._id);
    }
    else {
      var i=this.config.flips.indexOf(coupon._id)
      if(i>-1)this.config.flips.splice(i,1);
    }

  }

  showPromoCode(gain:number,promo_codes:string) {
    for(let item in promo_codes.split(',')){
      if(gain>Number(item.split("=")[1]))
        return item.split("=")[0];
    }
    return "";
  }

  handle=null;
  onPanRight($event,coupon:any) {
    clearTimeout(this.handle);
    this.handle=setTimeout(()=>{this.remove(coupon);},500);
  }
}

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
import {isLocal, sendToPrint, showError, traitement_coupon} from "../tools";
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

  @Output('delete') ondelete: EventEmitter<any>=new EventEmitter();
  @Output('update') onupdate: EventEmitter<any>=new EventEmitter();
  @Output('flash') onflash: EventEmitter<any>=new EventEmitter();
  @Output('edit') onedit: EventEmitter<any>=new EventEmitter();

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

  showCode(coupon: any) {
    coupon.visible=true;
    coupon.qrcode = environment.domain_appli + '/getqrcode/' + coupon._id;

    this.meta.removeTag('name = "og:url"');
    this.meta.removeTag('name = "og:type"');
    this.meta.removeTag('name = "og:title"');
    this.meta.removeTag('name = "og:description"');
    this.meta.removeTag('name = "og:image"');
    this.meta.addTags([
      {name:"og:url",content:coupon.url},
      {name:"og:type",content:"shopping"},
      {name:"og:title",content:coupon.label},
      {name:"og:description",content:"Ouvrir pour profiter vous aussi de la promotion"},
      {name:"og:image",content:coupon.qrcode}
      ],true);


    if(coupon.showCode==null)coupon.showCode=false;
    coupon.showCode = !coupon.showCode;

    if(coupon.showCode){
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

          this.snackBar.open("Invitation dans le presse-papier, prête à être envoyé via SMS, WhatsApp, etc ...");
        });
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

  showCoupon(coupon: any) {
    coupon.visible=!coupon.visible
    if(coupon.visible)
      localStorage.setItem("showCoupon",coupon._id);
    else
      localStorage.setItem("showCoupon",null);
  }

  isVisible(coupon:any){
    var couponToShow=localStorage.getItem("showCoupon");
    if(couponToShow==coupon._id)return true;
    return false;
  }

  flash(coupon:any){
    this.api.flash(this.user._id, coupon._id).subscribe((result:any) => {
      localStorage.setItem("showCoupon",result.newcoupon);
      this.user.message = result.message;
      this.onflash.emit({message:result.message});
    },(error)=>{showError(this,error);});
  }

  edit(coupon: any) {
  }
}

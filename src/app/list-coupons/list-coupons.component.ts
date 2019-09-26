import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ApiService} from '../api.service';
import {environment} from '../../environments/environment';
import {Router} from '@angular/router';
import {SocialService} from "ngx-social-button"
import { Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-list-coupons',
  templateUrl: './list-coupons.component.html',
  styleUrls: ['./list-coupons.component.css']
})
export class ListCouponsComponent implements OnInit {

  // tslint:disable-next-line:no-input-rename
  @Input('coupons') coupons: any[] = [];
  @Input('user') user: any;

  @Output('delete') ondelete: EventEmitter<any>=new EventEmitter();
  @Output('update') onupdate: EventEmitter<any>=new EventEmitter();

  constructor(public meta: Meta,public api: ApiService, public router: Router,private socialAuthService: SocialService) {
    meta.addTag({name:"application",content:"ReducShare"});
  }

  ngOnInit() {
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
  }

  showInfos(coupon: any) {
    if(coupon.showInfos==null)coupon.showInfos=false;
    coupon.showInfos = !coupon.showInfos;
  }

  showAddress(shop: any) {
    window.open('https://www.google.fr/maps/place/' + shop.address);
  }

  remove(coupon: any) {
    this.api.removeCoupon( coupon._id).subscribe(() => {
      this.ondelete.emit();
    });
  }

  openPrinter(coupon: any) {
    const printContent:any = document.getElementsByName("print-section")[0];
    const WindowPrt = window.open('', '', 'left=0,top=0,width=900,height=900,toolbar=0,scrollbars=0,status=0');
    WindowPrt.document.write(printContent.innerHTML);
    WindowPrt.document.close();
    WindowPrt.focus();
    WindowPrt.print();
  }

  socialSharing(coupon: any) {
    this.socialAuthService.facebookSharing({href:coupon.url,hashtag:coupon.label});
  }

  stopDeal(coupon: any) {
    this.api.stopdeal(coupon["_id"]).subscribe((mes:any)=>{
      this.onupdate.emit(mes);
    });
  }

  addfollow(userid: string, shopid: string) {
    this.api.follow(userid,"+",shopid).subscribe(()=>{});
  }
}

import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ApiService} from '../api.service';
import {environment} from '../../environments/environment';
import {Router} from '@angular/router';
import {Socket} from "ngx-socket-io";

@Component({
  selector: 'app-list-coupons',
  templateUrl: './list-coupons.component.html',
  styleUrls: ['./list-coupons.component.css']
})
export class ListCouponsComponent implements OnInit {

  // tslint:disable-next-line:no-input-rename
  @Input('coupons') coupons: any[] = [];
  @Output('delete') ondelete: EventEmitter<any>=new EventEmitter();

  constructor(public api: ApiService, public router: Router) { }

  ngOnInit() {
  }

  showCode(coupon: any) {
    coupon.qrcode = environment.root_api + '/getqrcode/' + coupon._id;
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
      //const pos = this.coupons.indexOf(coupon);
      //this.coupons = this.coupons.splice(pos + 1, 1        );
      this.ondelete.emit();
    });
  }

  printCode(coupon: any) {
    this.router.navigate(["print"]);
    //window.open('./web/showcode.html?coupon=' + coupon._id, 'blank');
  }
}

import {Component, Input, OnInit} from '@angular/core';
import {ApiService} from '../api.service';
import {environment} from '../../environments/environment';
import {Router} from '@angular/router';

@Component({
  selector: 'app-list-coupons',
  templateUrl: './list-coupons.component.html',
  styleUrls: ['./list-coupons.component.css']
})
export class ListCouponsComponent implements OnInit {

  // tslint:disable-next-line:no-input-rename
  @Input('coupons') coupons: any[] = [];

  constructor(public api: ApiService, public router: Router) { }

  ngOnInit() {
  }

  showCode(coupon: any) {
    coupon.qrcode = environment.root_api + '/getqrcode/' + coupon._id;
    coupon.showCode = true;
  }

  showAddress(shop: any) {
    window.open('https://www.google.fr/maps/place/' + shop.address);
  }

  remove(coupon: any) {
    this.api.removeCoupon( coupon._id).subscribe(() => {
      const pos = this.coupons.indexOf(coupon);
      this.coupons = this.coupons.splice(pos + 1, 1        );
    });
  }

  printCode(coupon: any) {
    window.open('./web/showcode.html?coupon=' + coupon._id, 'blank');
  }
}

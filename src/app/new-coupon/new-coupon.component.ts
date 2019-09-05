import { Component, OnInit } from '@angular/core';
import {FormControl} from '@angular/forms';
import {ApiService} from '../api.service';
import {MatSnackBar} from '@angular/material';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-new-coupon',
  templateUrl: './new-coupon.component.html',
  styleUrls: ['./new-coupon.component.css']
})
export class NewCouponComponent implements OnInit {
  coupon: any = {
    shop: 'test',
    teaser: '',
    unity: '% sur le prix',
    share_bonus: 1,
    direct_bonus: 0.3,
    pay_bonus: 3,
    max: 10,
    duration: 15,
    picture: 'https://static.ponroy.com/image/medias/PLANTES_ACTIFS/raisinblanc.jpg?p=product_showcase'
  };
  shopNameEdit = true;

  constructor(public snackBar: MatSnackBar,
              public api: ApiService,
              public router: Router,
              public route: ActivatedRoute) { }

  ngOnInit() {
    if (this.route.snapshot.queryParamMap.has('shop')) {
      this.shopNameEdit = false;
      this.coupon.shop = this.route.snapshot.queryParamMap.get('shop');
    }
  }

  addcoupon(coupon: any) {
    this.api.addCoupon(coupon).subscribe((result: any) => {
      this.snackBar.open(result.message, '', {
        duration: 2000,
      });
      this.router.navigate(['home']);
    });
  }
}

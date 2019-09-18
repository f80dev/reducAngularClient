import {Component, Inject, OnInit} from '@angular/core';
import {ApiService} from '../api.service';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {DialogData} from "../shops/shops.component";

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

  constructor(
              public dialogRef: MatDialogRef<NewCouponComponent>,
              public api: ApiService,
              @Inject(MAT_DIALOG_DATA) public data:DialogData) { }

  ngOnInit() {
    if (this.data!=null) {
      this.shopNameEdit = false;
      this.coupon.shop = this.data.shop;
    }
  }

  addcoupon(coupon: any) {
    this.api.addCoupon(coupon).subscribe((result: any) => {
      this.dialogRef.close(result);
    });
  }
}

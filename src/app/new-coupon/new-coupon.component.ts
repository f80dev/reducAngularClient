import {Component, Inject, OnInit} from '@angular/core';
import {ApiService} from '../api.service';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {DialogData} from "../shops/shops.component";
import {cropToSquare, resizeBase64Img} from "../tools";

@Component({
  selector: 'app-new-coupon',
  templateUrl: './new-coupon.component.html',
  styleUrls: ['./new-coupon.component.css']
})
export class NewCouponComponent implements OnInit {
  coupon: any = {
    shop: 'test',
    label: 'Promotion sur les vin blancs',
    unity: '% sur le prix',
    share_bonus: 1,
    direct_bonus: 0.3,
    pay_bonus: 3,
    max: 10,
    duration: 15,
    picture: 'https://static.ponroy.com/image/medias/PLANTES_ACTIFS/raisinblanc.jpg?p=product_showcase'
  };
  shopNameEdit = true;

  preview: string="";

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

  refreshPicture() {
    this.preview=this.coupon.picture;
  }

  onSelectFile(event:any) {
    if(event.target.files && event.target.files.length > 0) {
      var reader = new FileReader();
      reader.onload = ()=>{
        var dataURL = reader.result;
        resizeBase64Img(dataURL,800,0.5,(result=>{
          cropToSquare(result,0.5,(result_square)=>{
            this.coupon.picture=result_square;
            this.preview=result_square;
          })
        }))

      };
      reader.readAsDataURL(event.target.files[0]);
    }
  }
}

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

  constructor(public snackBar: MatSnackBar,
              public router: Router,
              public api:ApiService,
              public dialog:MatDialog) {}


  ngOnChanges(){
    this.refresh();
  }

  refresh(showItem=-1){
    if(this.user!=null && this.user.coupons!=null){
      this.coupons=[];
      var i=0;
      this.user.coupons.forEach((coupon)=>{
        coupon.visible=false;
        if(i==showItem)coupon.visible=true;
        if(coupon.origin==coupon._id)
          this.coupons.push(coupon);
      });
    }

  }

  addCoupon(shop: any) {
    shop.showAddCoupon=true;
  }

  onInsert(shop:any){
    shop.showAddCoupon=false;
    this.oninsert.emit('coupon ajouté');
    this.refresh(0);
  }

  delShop(shop: any) {
    this.api.removeShop(shop._id).subscribe((result)=>{
      this.ondelete.emit(result);
    })
  }
}

import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Router} from '@angular/router';
import {ApiService} from "../api.service";
import {MatDialog, MatSnackBar} from "@angular/material";
import {NewCouponComponent} from "../new-coupon/new-coupon.component";

export interface DialogData {
  shop: string;
}

@Component({
  selector: 'app-shops',
  templateUrl: './shops.component.html',
  styleUrls: ['./shops.component.css']
})
export class ShopsComponent implements OnInit {
  // tslint:hkdisable-next-line:no-input-rename
  @Input('shops') shops = [];
  @Output('delete') ondelete: EventEmitter<any>=new EventEmitter();
  @Output('insert') oninsert: EventEmitter<any>=new EventEmitter();

  constructor(public snackBar: MatSnackBar,public router: Router,public api:ApiService,public dialog:MatDialog) { }

  ngOnInit() {
  }

  addCoupon(shop: any) {
    this.dialog.open(NewCouponComponent,{data:{shop:shop.name},width: '95%',height:'95%'}).afterClosed().subscribe((r)=>{
      if(r!=null){
        this.snackBar.open(r.message, '', {
          duration: 2000,
        });
        this.oninsert.emit();
      }
    });
  }

  delShop(shop: any) {
    this.api.removeShop(shop._id).subscribe((result)=>{
      this.ondelete.emit(result);
    })
  }
}

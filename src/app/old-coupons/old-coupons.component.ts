import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ApiService} from "../api.service";
import {ConfigService} from "../config.service";

@Component({
  selector: 'app-old-coupons',
  templateUrl: './old-coupons.component.html',
  styleUrls: ['./old-coupons.component.css']
})
export class OldCouponsComponent implements OnInit {

  constructor(public api:ApiService,public config:ConfigService) { }

  coupons:any[]=[];

  @Input("shop") shop:any;
  @Input("user") user:any;
  @Input("title") title:string="";
  @Output("select") onselect:EventEmitter<any>=new EventEmitter();
  @Output("delete") ondelete:EventEmitter<any>=new EventEmitter();
  @Output("cancel") oncancel:EventEmitter<any>=new EventEmitter();
  @Input("canDelete") canDelete: boolean=false;
  @Input("filter") filter: string="";

  ngOnInit() {
    this.refresh();
  }

  refresh(){
    this.coupons=JSON.parse(JSON.stringify(this.config.values.modeles));
    if(this.shop){
      this.api.getoldcoupons(this.shop._id,this.shop.owner).subscribe((r:any)=>{
        r.forEach((it)=>{
          this.coupons.splice(0,0,it);
        });
      });
    } else {
      this.coupons=JSON.parse(JSON.stringify(this.user.old_coupons));
      this.coupons.push(this.config.values.modeles);
    }
  }


  deleteCoupon(coupon: any) {
    this.api.removeCoupon(coupon._id,true).subscribe(()=>{
      this.ondelete.emit();
    });
  }

  opereFilter() {
    var lst_coupons=JSON.parse(JSON.stringify(this.coupons));
    var index=0;
    lst_coupons.forEach((it)=>{
      var bc=false;
      if(it.tags){
        it.tags.forEach((tag)=>{
          if(this.filter.indexOf(tag)>-1)bc=true;
        });
      }
      if(!bc){
        this.coupons.splice(index,1);
      }

    });
  }
}

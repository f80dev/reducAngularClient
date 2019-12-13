import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ApiService} from "../api.service";
import {ConfigService} from "../config.service";
import {$$, showError} from "../tools";
import {PromptComponent} from "../prompt/prompt.component";
import {MatDialog} from "../../../node_modules/@angular/material/dialog";
import { Router} from '@angular/router';

@Component({
  selector: 'app-old-coupons',
  templateUrl: './old-coupons.component.html',
  styleUrls: ['./old-coupons.component.css']
})
export class OldCouponsComponent implements OnInit {

  constructor(public router:Router,public dialog: MatDialog,public api:ApiService,public config:ConfigService) { }

  coupons:any[]=[];
  mycoupons:any[]=[];
  withFilter=false;
  tags:any[]=[];

  @Input("shopid") shopid="";
  @Input("level") level=0;
  @Input("askFilter") askFilter=false;
  @Input("title") title:string="";
  @Input("subtitle") subtitle:string="";
  @Output("select") onselect:EventEmitter<any>=new EventEmitter();
  @Output("delete") ondelete:EventEmitter<any>=new EventEmitter();
  @Output("cancel") oncancel:EventEmitter<any>=new EventEmitter();
  @Input("canDelete") canDelete: boolean=false;
  @Input("filter") filter="";
  selTags: any=[];


  ngOnInit() {
    this.tags=this.config.getTags(this.level);

    this.askFilter=(this.filter.length==0 && this.level<2);
    this.refresh(()=>{
      if(this.filter.length>0)this.opereFilter();
    });
  }

  /**
   *
   * @param func
   */
  refresh(func=null){
    this.withFilter=false;
    this.coupons=[];
    this.mycoupons=[];

    if(this.config.values==null){
      this.router.navigate(['login']);
      return;
    }

    var modeles=JSON.stringify(this.config.values.modeles);
    if(modeles!=null){
      JSON.parse(modeles).forEach((c)=>{
        if(c.level<=this.level && c.score>2)
          this.coupons.push(c);
      });
    }

    if(this.shopid){
      this.api.getoldcoupons(this.shopid).subscribe((r:any)=>{
        r.forEach((it)=>{
          this.mycoupons.push(it);
        });
        if(func!=null)func();
      },(error)=>{showError(this,error);});
    } else {
      // this.coupons=JSON.parse(JSON.stringify(this.user.old_coupons));
      // this.coupons.push(this.config.values.modeles);
    }
  }


  /**
   *
   * @param coupon
   */
  deleteCoupon(coupon: any) {
    this.api.removeCoupon(coupon._id,true).subscribe(()=>{
      this.ondelete.emit();
    },(error)=>{showError(this,error);});
  }

  it(x,y){
    var c=0,o=0;
    x.sort((a,b) => {return a - b;}).forEach(i => { if (i>o){ if(y.indexOf(i) >= 0) c++; } o=i });
    return c;
  }

  opereFilter() {
    $$("Application du filtre="+this.filter);
    this.withFilter=true;
    if(this.filter.length==0){
      this.withFilter=false;
      return;
    }
    var lst_coupons=JSON.parse(JSON.stringify(this.coupons));
    this.coupons=[];
    var index=0;
    lst_coupons.forEach((it)=>{
      if(it.tags.length>0){
        if(this.filter.indexOf(it.tags)>=0)
          this.coupons.push(it);
      } else {
        this.coupons.push(it);
      }
    });
    if(this.coupons.length==0)this.coupons=lst_coupons;
  }

  changeFilter() {
    this.askFilter=(this.filter.length==0);
  }

  selFilter(selTag:string=""){
    this.filter=selTag;
    this.askFilter=false;
    this.refresh(()=>{
      this.opereFilter();
    });
  }
}

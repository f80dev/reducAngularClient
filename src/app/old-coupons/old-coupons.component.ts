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
  withFilter=false;

  @Input("shop") shop:any;
  @Input("level") level=0;
  @Input("askFilter") askFilter=false;
  @Input("title") title:string="";
  @Input("subtitle") subtitle:string="";
  @Output("select") onselect:EventEmitter<any>=new EventEmitter();
  @Output("delete") ondelete:EventEmitter<any>=new EventEmitter();
  @Output("cancel") oncancel:EventEmitter<any>=new EventEmitter();
  @Input("canDelete") canDelete: boolean=false;
  @Input("filter") filter: string="";
  selTags: any=[];

  ngOnInit() {
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

    if(this.config.values==null){
      this.router.navigate(['login']);
      return;
    }

    var modeles=JSON.stringify(this.config.values.modeles);
    if(modeles!=null){
      JSON.parse(modeles).forEach((c)=>{
        if(c.level<=this.level)
          this.coupons.push(c);
      });
    }

    if(this.shop){
      this.api.getoldcoupons(this.shop._id).subscribe((r:any)=>{
        r.forEach((it)=>{
          this.coupons.splice(0,0,it);
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
    if(this.filter==this.config.values.tags){
      this.withFilter=false;
      return;
    }
    var lst_coupons=JSON.parse(JSON.stringify(this.coupons));
    this.coupons=[];
    var index=0;
    lst_coupons.forEach((it)=>{
      if(it.tags.length>0){
        var intersect=this.filter.split(",").filter(value => -1 !== it.tags.split(",").indexOf(value));
        if(intersect.length>0)
          this.coupons.push(it);
      } else {
        this.coupons.push(it);
      }
    });
    if(this.coupons.length==0)this.coupons=lst_coupons;
  }

  changeFilter() {
    this.askFilter=(this.filter.length==0);

    // this.dialog.open(PromptComponent,{width: '250px',data: {title: "Filtre", question: "Choisir un tag parmi "+this.config.values.tags,onlyConfirm:false}})
    //   .afterClosed().subscribe((result) => {
    //     this.filter=result;
    //     this.refresh();
    // });
  }

  selFilter(){
    var rc="";
    if(this.selTags.length==0)
      rc=this.config.values.tags;
    else {
      this.selTags.forEach((f:any)=> {
        rc=rc+","+f.getLabel().trim();
      });
    }

    this.filter=rc.substr(1);
    this.askFilter=false;
    this.refresh(()=>{
      if(this.selTags.length>0)this.opereFilter();
    });
  }
}

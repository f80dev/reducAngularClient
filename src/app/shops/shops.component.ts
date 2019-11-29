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
import {openGraphForShop, sendToPrint, showError, showMessage, traitement_coupon} from "../tools";
import {PromptComponent} from "../prompt/prompt.component";
import {ConfigService} from "../config.service";


@Component({
  selector: 'app-shops',
  templateUrl: './shops.component.html',
  styleUrls: ['./shops.component.css']
})
export class ShopsComponent implements OnInit {
  @Input('user') user:any={};

  @Output('delete') ondelete: EventEmitter<any>=new EventEmitter();
  @Output('insert') oninsert: EventEmitter<any>=new EventEmitter();
  @Output('update') onupdate: EventEmitter<any>=new EventEmitter();
  @Output('open') onopen: EventEmitter<any>=new EventEmitter();

  message="";
  showWebCam=false;

  constructor(public snackBar: MatSnackBar,
              public router: Router,
              public config:ConfigService,
              public dialog:MatDialog,
              public api:ApiService) {
  }



  onInsert(){
    //shop.showAddCoupon=false;
    this.oninsert.emit('coupon ajouté');
  }

  delShop(shop: any) {
    this.api.removeShop(shop._id).subscribe((result)=>{
      this.ondelete.emit(result);
    },(error)=>{showError(this,error);});
  }

  openPrinter(shop:any){
    sendToPrint("print-section-"+shop._id);
  }

  edit(shop:any,coupon:any){
    this.api.shop=shop;
    this.api.coupon=coupon;
    this.api.user=this.user;
    this.router.navigate(["new_coupon"],{queryParams:
        {
          couponid:coupon._id,
          title:"Editer "+coupon.title,
          level:this.user.level,
          shopname:shop.name,
          edit:true,
          userid:this.user._id
        }
    });
  }

  addCoupon(shop: any,modele:string) {
    this.api.shop=shop;
    this.api.user=this.user;

    var command="new_coupon";
    if(this.user.level<1)command="new_coupon_simple";

    this.router.navigate([command],{queryParams:{
        shopid:shop._id,
        level:this.user.level,
        shopname:shop.name,
        edit:false,
        modele:modele,
        tags:shop.tags,
        userid:this.user._id
      }}
    );
  }


  setDelegate(shop:any) {
    if(this.config.webcamsAvailable==0){
      this.dialog.open(PromptComponent, {width: '250px',
        data: {
                title: "Code utilisateur",
                question:"Demander le code à l'utilisateur auquel vous souhaitez déléguer la validation des promotions",
                onlyConfirm: false
      }
      }).afterClosed().subscribe((result) => {
        if(result!=null && result.length>0)
          this.api.delegate(result,shop._id).subscribe((res:any)=>{
            showMessage(this,res.message);
          },(error:any)=>{

            showMessage(this,error.message);
          });
      });
    } else {
      this.showWebCam=!this.showWebCam;
    }

  }

  onFlash_event(decoded: any,shop:any) {
    if(decoded!=null){
      var result=decoded.data;
      if(result!=null && result.length>0){
        this.user.message="Utilisateur ajouté comme délégataire";
        this.api.delegate(result,shop._id).subscribe(()=>{
          this.showWebCam=false;
        },(error)=>{showError(this,error);});
      }
    }
  }

  ngOnInit(): void {
    setTimeout(()=> {
      if(this.user.shops!=null && this.user.shops.length>0 && this.config.params.command.indexOf("add_promo")>-1){
        var modele="";
        if(this.config.params.command.indexOf("(")>-1)modele=this.config.params.command.split("add_promo(")[1].split(")")[0];
        this.config.params.command="";
        this.addCoupon(this.user.shops[0],modele);
      }
    },1500);
  }

  openGraph(shoid){
    this.onopen.emit({shopid:shoid});
  }

  showShop(shop,value=null) {
    if(value==null)
      shop.visible=!shop.visible;
    else {
      shop.visible=value;
    }
    if(shop.visible)localStorage.setItem("showShop",shop._id);

  }

  editShop(shop: any,event) {
    event.stopPropagation();
    this.api.shop=shop;
    this.api.user=this.user;
    this.router.navigate(['shop'],
      {queryParams:
          {
            edit:true,
            userid:this.user._id,
            pseudo:this.user.pseudo,
            tags:this.user.tags,
            anonymous:this.user.email.indexOf("fictif.com")>-1
          }
      });
  }
}

import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Router} from "@angular/router";
import {LocService} from "../loc.service";
import {$$, createMap, createMarker, getMarkerLayer, initAvailableCameras, selectFile} from "../tools";
import {ApiService} from "../api.service";
import {PromptComponent} from "../prompt/prompt.component";
import {MatDialog} from '@angular/material/dialog';
import {WebcamUtil} from 'ngx-webcam';
import {Observable,Subject} from "rxjs";
import jsQR from "jsqr"
import {ConfigService} from "../config.service";
import {LoginComponent} from "../login/login.component";

declare var ol: any;


@Component({
  selector: 'app-userform',
  templateUrl: './userform.component.html',
  styleUrls: ['./userform.component.css']
})
export class UserformComponent implements OnInit {


  @Input("user") user:any;
  @Input("excludes") excludes:any[]=[];
  @Output('flash') onflash: EventEmitter<any>=new EventEmitter();
  @Output('update') onupdate: EventEmitter<any>=new EventEmitter();

  showScanner: boolean = false;
  showMap: boolean=false;
  showOldPromos: boolean=false;
  private map: any;
  handle:any;

  showCouponOnMap:any[]=[];
  showPersonalCode: boolean=false;

  constructor(public dialog: MatDialog,public router:Router,
              public loc:LocService,public api:ApiService,
              public config:ConfigService) { }



  ngOnInit() {

  }


  flash(){
    this.showCouponOnMap=[];
    this.showMap=false;
    this.onflash.emit();
  }

  onflash_event(decoded: any) {
      var coupon=decoded.data.split("/home/")[1];
      this.startScanner();
      this.api.flash(this.user._id, coupon).subscribe((result:any) => {
        localStorage.setItem("showCoupon",result.newcoupon);
        this.user.message = result.message;
        this.onflash.emit({message:result.message});
      });
  }

  onSelectFile(event:any) {
    selectFile(event,200,(res)=>{
      this.user.photo=res;
      this.saveUser();
    });
  }

  addshop() {
    this.showMap=false;
    this.router.navigate(['shop'],{queryParams:{userid:this.user._id}});
  }


  showPromoInSquare(){
    //voir https://openlayers.org/en/latest/examples/moveend.html
    if(!this.map)return false;

    var square=this.map.getView().calculateExtent(this.map.getSize());
    var bottomLeft = ol.proj.toLonLat(ol.extent.getBottomLeft(square));
    var topRight = ol.proj.toLonLat(ol.extent.getTopRight(square));
    this.api.getcouponinsquare({x0:bottomLeft[0],y0:bottomLeft[1],x1:topRight[0],y1:topRight[1]}).subscribe((coupons:any)=>{
      var l=getMarkerLayer(this.map);
      this.showCouponOnMap=[];
      var markers=[
        createMarker(this.user.position.lng,this.user.position.lat,this.config.values.icon_person)
      ];
      coupons.forEach((c)=>{
        //Vérifie que l'utilisateur n'a pas déjà le coupon
        c.visible=false;
        var bContinue=true;
        if(c.owner==this.user._id)bContinue=false;
        this.excludes.forEach((exclude_c)=>{
          if(c._id==exclude_c.origin)bContinue=false;
        });

        if(bContinue){
          var marker=createMarker(Number(c.lng),Number(c.lat),this.config.values.icon_coupon,c,0.15,(coupon_sel)=>{
            this.user.message=coupon_sel.label+", Gain:"+coupon_sel.direct_bonus+coupon_sel.symbol;
          });
          markers.push(marker);
          marker.coupon.visible=false;
          this.showCouponOnMap.push(marker.coupon);
        }
      });
      l.getSource().clear();
      l.getSource().addFeatures(markers);
    })
  }

  openLoc() {
    this.showMap=!this.showMap;
    if(this.showMap){
      this.loc.getPosition().then((pos:any)=>{
        if(this.map==null){
          clearTimeout(this.handle);
          this.handle=setTimeout(()=>{
            this.user.position=pos;
            this.map=createMap(pos,this.config.values.icon_person,15,0.1,()=>{
              this.showPromoInSquare();
            },(coupon)=>{
              this.showCouponOnMap=[coupon];
            });
          },1000);
        } else {
          this.showPromoInSquare();
        }
      });
    } else {
      this.map=null;
    }

  }

  promptForPseudo() {
    this.dialog.open(PromptComponent,{width: '250px',data: {title: "Pseudo", question: "Votre pseudo ?",onlyConfirm:false}})
        .afterClosed().subscribe((result) => {
          if(result!=null && result.length>0){
            this.user.pseudo = result;
            this.saveUser();
          }
        });
  }

  private saveUser() {
    this.api.setuser(this.user).subscribe((r:any)=>{
      this.user.message=r.message;
    });
  }

  clearAccount(id:string) {
    this.dialog.open(PromptComponent, {
      width: '250px', data: {
        onlyConfirm: true,
        title: "Etes vous sûr ?",
        question: "En supprimant votre compte, vous perdez toutes vos promotions en cours."
      }
    }).afterClosed().subscribe((result) => {
      if(result=="yes"){
        this.api.raz(id).subscribe(()=> {
          window.location.reload();
        });
      }
    });
  }

  startScanner() {
    this.showScanner=! this.showScanner;
    if(this.showScanner){
      this.user.message="Ouverture du scanner";

    } else {

    }
  }


  setWebhook() {
    this.dialog.open(PromptComponent,{width:'90vw',data: {result:this.user.webhook,title: "URL de notification ?"}})
      .afterClosed().subscribe((result) => {
        if(result){
          this.user.webhook=result;
          this.api.setuser(this.user).subscribe(()=>{
            this.user.message="Notification mise en place";
          });
        }
    });
  }

  upgradeLevel() {
    this.user.level++;
    this.api.setuser(this.user).subscribe(()=>{
      this.user.message="vous avez maintenant un profil avancé";
    })
  }

  logout(){
    localStorage.clear();
    this.onupdate.emit(this.user);
  }

  securise() {
    this.dialog.open(LoginComponent,{width:'250px',data: {facebook:true,google:true,user:this.user}})
      .afterClosed().subscribe((result:any) => {
        if(result){
          this.user=result.user;
          this.onupdate.emit(this.user);
        } else {
          $$("Probleme de récupération du user")
        }

    });
  }
}

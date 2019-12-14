import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Router} from "@angular/router";
import {LocService} from "../loc.service";
import {
  $$,
  createMap,
  createMarker,
  getMarkerLayer, getSize,
  loginWithEmail,
  showError, showMessage
} from "../tools";
import {ApiService} from "../api.service";
import {PromptComponent} from "../prompt/prompt.component";
import {MatDialog} from '@angular/material/dialog';
import {ConfigService} from "../config.service";
import {ImageSelectorComponent} from "../image-selector/image-selector.component";
import {MatSnackBar} from "@angular/material";
import { faFileInvoiceDollar,faQrcode, faSignInAlt,faSignOutAlt,faVial} from '@fortawesome/free-solid-svg-icons';

declare var ol: any;
declare var EXIF: any;

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
  @Output('refresh') onrefresh: EventEmitter<any>=new EventEmitter();

  faSignInAlt=faSignInAlt;
  faFileInvoiceDollar=faFileInvoiceDollar;
  faVial=faVial;
  faQrcode=faQrcode;
  faSignOutAlt=faSignOutAlt;

  showScanner: boolean = false;
  showMap: boolean=false;
  showTransac:boolean=false;
  showOldPromos: boolean=false;
  private map: any;
  handle:any;
  message="";

  sort="dtCreate";
  showCouponOnMap:any[]=[];
  showPersonalCode: boolean=false;
  filter_tag="";

  constructor(public dialog: MatDialog,public router:Router,
              public loc:LocService,public api:ApiService,
              public snackBar:MatSnackBar,
              public config:ConfigService) {
  }

  checkCommand(command){
    if(command.indexOf("add_pseudo")>-1){
      this.config.params.command=this.config.params.command.replace("add_pseudo","");
      if(this.user.pseudo==null || this.user.pseudo.length==0){
        this.promptForPseudo(null,"un petit pseudo pour commencer ?",()=>{
          this.checkCommand(this.config.params.command)
        })
      }
    } else {
      if(command.indexOf("add_shop")>-1){
        this.config.params.command=this.config.params.command.replace("add_shop","");
        if(this.user.shops==null || this.user.shops.length==0){
          setTimeout(()=>{
            let param="";
            if(command.indexOf("add_shop(")>-1)param=command.split("add_shop(")[1].split(")")[0];
            this.addshop(param);
          },1500);
        }
      }
    }
  }


  ngOnInit() {
    if(this.config.params.map!=null && this.config.params.map.length>0){
      this.openLoc();
      if(this.config.params.map.indexOf(",")>-1){
        setTimeout(()=>{
          var latlon=this.config.params.map.split(",");
          this.map.getView().setCenter(ol.proj.fromLonLat([Number(latlon[1]), Number(latlon[0])]));
          this.showPromoInSquare();
        },500)
      }
    }

    setTimeout(()=>{
      this.checkCommand(this.config.params.command);
    },500);
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
        this.onflash.emit({message:result.message});
      },(error)=>{showError(this,error);});
  }


  /**
   *
   * @param params contient la liste tags,nom de la boutique, adresse
   */
  addshop(params="") {
    var tags="";
    var default_name="";

    if(params.length>0){
      var sep=";";
      tags=params.split(sep)[0];
      if(params.indexOf(sep)>-1){
        default_name=params.split(sep)[1];
        for(var i=0;i<10;i++)default_name=default_name.replace("_"," ");
      }
    }

    this.showMap=false;
    this.api.user=this.user;
    if(this.user.tags.length>0)tags=this.user.tags;

    let picture="";
    if(tags!="" && this.config.values!=null && this.config.values.tags_details[tags].picture!=null){
      picture=this.config.values.tags_details[tags].picture;
    }

    this.router.navigate(['shop'],
      {queryParams:
          {
            shop:null,
            default_name:default_name,
            picture:picture,
            level:this.user.level,
            userid:this.user._id,
            pseudo:this.user.pseudo,
            tags:tags,
            anonymous:this.user.email.indexOf("fictif.com")>-1
          }
      });
  }

  createMarkersFromCoupons(coupons,markers,layer){
    coupons.forEach((c)=>{
      //Vérifie que l'utilisateur n'a pas déjà le coupon
      c.visible=false;
      var bContinue=true;
      if(this.filter_tag.length>0 && (this.filter_tag.indexOf(c.tags)==-1 && c.tags.length>0))bContinue=false; //Rejet sur le critère du filtre
      if(c.owner==this.user._id)bContinue=false;//Rejet sur le critere de la possession
      this.excludes.forEach((exclude_c)=>{
        if(c._id==exclude_c.origin)bContinue=false;
      });

      if(bContinue){
        var icon=this.config.values.icon_coupon;

        var scale=Math.max(0.20/coupons.length,0.10);
        if(coupons.length<3)icon=c.picture;

        //Ajoute le coupon sur la carte par création d'un marker
        var marker=createMarker(Number(c.lng),Number(c.lat),null,c,scale);
        markers.push(marker);
        marker.coupon.visible=false;
        this.showCouponOnMap.push(marker.coupon);
      }
    });

    layer.getSource().clear();
    layer.getSource().addFeatures(markers);
  }

  /**
   * Montre les promos sur la carte
   */
  showPromoInSquare(){
    //voir https://openlayers.org/en/latest/examples/moveend.html
    if(!this.map)return false;
    var user_x=0;
    var user_y=0;
    if(this.user.position!=null){
      user_x=this.user.position.lng;
      user_y=this.user.position.lat;
    }


    var square=this.map.getView().calculateExtent(this.map.getSize());
    var bottomLeft = ol.proj.toLonLat(ol.extent.getBottomLeft(square));
    var topRight = ol.proj.toLonLat(ol.extent.getTopRight(square));
    this.api.getcouponinsquare({
      x0:bottomLeft[0],y0:bottomLeft[1],x1:topRight[0],y1:topRight[1],
      user:{x:user_x,y:user_y}
    }).subscribe((coupons:any)=>{
      var l:any=getMarkerLayer(this.map);
      //this.snackBar.open(coupon_sel.label+", Gain:"+coupon_sel.direct_bonus+coupon_sel.symbol,null,{duration:10000});

      this.showCouponOnMap=[];
      var scale=0.1;
      if(this.user.photosize!=null)scale=25/this.user.photosize;
      var markers=[];

      if(this.user.position!=null){
        markers.push(createMarker(this.user.position.lng,this.user.position.lat,this.user.photo,null,scale));
         this.api.getCouponsAround(this.user.position.lng,this.user.position.lat).subscribe((cs:any[])=>{
           for(let c of cs){
             coupons.push(c);
           }
           this.createMarkersFromCoupons(coupons,markers,l);
         })
      } else
        this.createMarkersFromCoupons(coupons,markers,l);



    })
  }

  /**
   *
   */
  openLoc() {
    this.showMap=!this.showMap;
    if(this.showMap){

      if(this.user.photosize==null)
        getSize(this.user.photo,(w,h)=>{
          this.user.photosize=Math.max(w,h);
        });

      this.loc.getPosition().then((pos:any)=>{
        this.user.lat=pos.lat;
        this.user.lng=pos.lng;
        this.user.dtUpdatePosition=new Date().getTime()/1000;
        this.api.setuser(this.user).subscribe(()=>{});
        this.initMap(pos,15);
      },()=>{
        this.initMap({lng:2,lat:48},5);
      });
    } else {
      this.map=null;
    }
  }


  promptForPseudo(event,title="Votre pseudo ?",func=null) {
    if(event)event.stopPropagation();
    this.dialog.open(PromptComponent,
      {width: '250px',data: {title: "Pseudo", question: title,onlyConfirm:false}})
        .afterClosed().subscribe((result) => {
          if(result!=null && result.length>0){
            this.user.level+=0.1;
            this.user.pseudo = result;
            this.saveUser();
          }
          if(func!=null)func();
        });
  }

  private saveUser() {
    this.api.setuser(this.user).subscribe((r:any)=>{
      this.user.message=r.message;
    },(error)=>{showError(this,error);});
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
      this.showMap=false;
      this.user.message="Pointer le QRCode d'une promotion pour la récupérer";

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
      this.user.message="vous avez un profil avancé";
    })
  }

  logout(){
    this.dialog.open(PromptComponent, {
      width: '250px', data: {
        onlyConfirm: true,
        title: "Vous deconnecter de ce compte ?",
        question: "Vous serez automatiquement placer sur un profil anonyme, vous pouvez vous reconnecter depuis n'importe quel appareil"
      }
    })
      .afterClosed().subscribe((result) => {

        if(result=="yes"){
        localStorage.clear();
        this.onupdate.emit(this.user);
      }

    });

  }

  securise(){
    localStorage.setItem("old_user",localStorage.getItem("user"));
    loginWithEmail(this,this.user,(result:any)=>{
      if(result.user!=null){
        this.user=result.user;
        this.onupdate.emit(this.user);
        showMessage(this,"Authentification validée");
      } else {
        showMessage(this,result["message"]);
      }
    },()=>{
      showMessage(this,"Authentification annulée, vous restez anonyme");
    });
  }

  private initMap(pos: any,zoom:number=15) {
    if(this.map==null){
      clearTimeout(this.handle);
      this.handle=setTimeout(()=>{
        this.user.position=pos;
        this.map=createMap(pos,this.user.photo,zoom,0.1,()=>{
          this.showPromoInSquare();
        },null,(marker)=>{
          if(marker.coupon){
            localStorage.setItem("showCoupon",marker.coupon._id);
            this.showCouponOnMap=[marker.coupon];
          }
        });
      },1000);
    } else {
      this.showPromoInSquare();
    }
  }

  sortCoupons() {
    if(this.sort="dtCreate")this.sort="gain"; else this.sort="dtCreate"
    $$("Reclassement de la liste suivant "+this.sort);
    this.onrefresh.emit({sort:this.sort});
  }

  addImage(event) {
    event.stopPropagation();
    this.dialog.open(ImageSelectorComponent, {position:{left:'5vw',top:'10vh'},width: '90vw',height:'90vh', data:
        {
          result:this.user.photo,
          width: 250,
          height:250,
          emoji:true,
          ratio:1
        }
    }).afterClosed().subscribe((result) => {
      if(result){
        this.user.photo=result;
        this.api.setuser(this.user).subscribe(()=>{
          this.showPromoInSquare();
        });
      }
    });
  }


}

import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Router} from "@angular/router";
import {LocService} from "../loc.service";
import {createMap, createMarker, getMarkerLayer, selectFile} from "../tools";
import {ApiService} from "../api.service";
import {PromptComponent} from "../prompt/prompt.component";
import {MatDialog} from '@angular/material/dialog';
import {WebcamImage, WebcamInitError, WebcamUtil} from 'ngx-webcam';
import {Observable,Subject} from "rxjs";
import jsQR from "jsqr"
import {ConfigService} from "../config.service";


declare var ol: any;


@Component({
  selector: 'app-userform',
  templateUrl: './userform.component.html',
  styleUrls: ['./userform.component.css']
})
export class UserformComponent implements OnInit {


  @Input("user") user:any;
  @Output('flash') onflash: EventEmitter<any>=new EventEmitter();

  showScanner: boolean = false;
  showMap: boolean=false;
  showOldPromos: boolean=false;
  private map: any;
  webcamsAvailable=0;
  handle:any;

  constructor(public dialog: MatDialog,public router:Router,
              public loc:LocService,public api:ApiService,
              public config:ConfigService) { }

  private trigger: Subject<void> = new Subject<void>();
  private nextWebcam: Subject<boolean|string> = new Subject<boolean|string>();



  ngOnInit() {
    this.initAvailableCameras();
  }

  public get triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
  }

  public get nextWebcamObservable(): Observable<boolean|string> {
    return this.nextWebcam.asObservable();
  }

  initAvailableCameras(){
    WebcamUtil.getAvailableVideoInputs()
      .then((mediaDevices: MediaDeviceInfo[]) => {
        if(mediaDevices==null)
          this.webcamsAvailable =0;
        else
          this.webcamsAvailable = mediaDevices.length;
      });
  }


  handleImage(event: any) {
    var rc=event.imageData;
    var decoded =jsQR(rc.data,rc.width,rc.height);
    if(decoded!=null && decoded.data!=null && decoded.data.startsWith("http") && decoded.data.indexOf("/login")>-1){
      var coupon=decoded.data.split("/login/")[1];
      this.startScanner();
      this.api.flash(this.user._id, coupon).subscribe((result:any) => {
        localStorage.setItem("showCoupon",coupon);
        this.user.message = result.message;
        this.onflash.emit({message:result.message});
      });
    }
  }

  onSelectFile(event:any) {
    selectFile(event,200,(res)=>{
      this.user.photo=res;
      this.saveUser();
    });
  }

  addshop() {
    this.router.navigate(['shop']);
  }


  showPromoInSquare(){
    //voir https://openlayers.org/en/latest/examples/moveend.html
    var square=this.map.getView().calculateExtent(this.map.getSize());
    var bottomLeft = ol.proj.toLonLat(ol.extent.getBottomLeft(square));
    var topRight = ol.proj.toLonLat(ol.extent.getTopRight(square));
    this.api.getcouponinsquare({x0:bottomLeft[0],y0:bottomLeft[1],x1:topRight[0],y1:topRight[1]}).subscribe((coupons:any)=>{
      var l=getMarkerLayer(this.map);
      coupons.forEach((c)=>{
        var marker=createMarker(c.lng,c.lat,this.config.values.icon_coupon);
        l.getSource().addFeature(marker);
      });
    })
  }

  openLoc() {
    this.showMap=!this.showMap;
    if(this.showMap){
      this.loc.getPosition().then((pos:any)=>{
        if(this.map==null){
          this.map=createMap(pos,this.config.values.icon_person,15,()=>{
            this.showPromoInSquare();
          });
        }
        this.showPromoInSquare();

        //this.user.coupons.forEach((c)=>{})

      });
    }

  }

  promptForPseudo() {
    this.dialog.open(PromptComponent,{width: '250px',data: {title: "Pseudo", question: "Votre pseudo ?"}})
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
    // this.api.raz(id).subscribe(()=>{
    //
    // });
  }

  startScanner() {
    this.showScanner=! this.showScanner;
    if(this.showScanner){
      this.user.message="Ouverture du scanner";
      this.handle=setInterval(()=>{
        this.trigger.next();
      },250);
    } else {
      clearInterval(this.handle);
    }

  }
}

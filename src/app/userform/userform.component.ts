import {Component, Input, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {LocService} from "../loc.service";
import {createMarker, selectFile} from "../tools";
import {ApiService} from "../api.service";
import {PromptComponent} from "../prompt/prompt.component";
import {MatDialog} from '@angular/material/dialog';
import {WebcamImage, WebcamInitError, WebcamUtil} from 'ngx-webcam';
import {Observable,Subject} from "rxjs";
import jsQR from "jsqr"

declare var ol: any;


@Component({
  selector: 'app-userform',
  templateUrl: './userform.component.html',
  styleUrls: ['./userform.component.css']
})
export class UserformComponent implements OnInit {


  @Input("user") user:any;
  showScanner: boolean = false;
  showMap: boolean=false;
  showOldPromos: boolean=false;
  private map: any;
  private vectorLayer: any;
  webcamsAvailable=0;
  handle:any;

  constructor(public dialog: MatDialog,public router:Router,public loc:LocService,public api:ApiService) { }

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
        this.user.message = result.message;
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

  showPromoInSquare(x0,y0,x1,y1){
    this.api.getcouponinsquare({x0:x0,y0:y0,x1:x1,y1:y1}).subscribe((coupons:any)=>{
      var markers=[];
      coupons.forEach((c)=>{
        markers.push(createMarker(ol,c.lng,c.lat,""));
      });
      this.vectorLayer.features=markers;
    })
  }

  openLoc() {
    this.loc.getPosition().then((pos:any)=>{
      this.showMap=true;

      setTimeout(()=>{
        if(this.map==null){

          this.vectorLayer=new ol.layer.Vector({
            source: new ol.source.Vector({
              features: [
                createMarker(ol,pos.lng,pos.lat,"https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/240/google/223/man_1f468.png")
              ]
            })
          });

          this.map = new ol.Map({
            target: 'map',
            layers: [
              new ol.layer.Tile({
                source: new ol.source.OSM()
              }),
              this.vectorLayer,
            ],
            view: new ol.View({
              center: ol.proj.fromLonLat([pos.lng, pos.lat]),
              zoom: 18
            })
          });


        }

        this.user.coupons.forEach((c)=>{

        })
      });

    })
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

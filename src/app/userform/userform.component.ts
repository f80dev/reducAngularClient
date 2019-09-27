import {Component, Input, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {LocService} from "../loc.service";
import {createMarker, selectFile} from "../tools";
import {ApiService} from "../api.service";
import {PromptComponent} from "../prompt/prompt.component";
import {MatDialog} from '@angular/material/dialog';
import {NONE_TYPE} from "../../../node_modules/@angular/compiler/src/output/output_ast";

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

  constructor(public dialog: MatDialog,public router:Router,public loc:LocService,public api:ApiService) { }



  ngOnInit() {

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
          debugger;
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
    this.api.setuser(this.user).subscribe(()=>{});
  }
}

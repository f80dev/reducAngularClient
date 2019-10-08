import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ApiService} from '../api.service';
import {checkLogin, createMap, createMarker, getMarkerLayer, normeString, showError} from '../tools';
import {ActivatedRoute, Router} from '@angular/router';
import { Location } from '@angular/common';
import {LocService} from "../loc.service";
import {ConfigService} from "../config.service";
import {MatDialog, MatSnackBar} from "@angular/material";

declare var ol: any;

@Component({
  selector: 'app-newshop',
  templateUrl: './newshop.component.html',
  styleUrls: ['./newshop.component.css']
})

export class NewshopComponent implements OnInit {
  shopname = '';
  _public=false;
  address = 'paris,france';
  show_address="";
  anonymous=true;
  website="";
  owner = '';
  map: any;
  handle:any;
  tags="";

  @Output('insert') oninsert: EventEmitter<any>=new EventEmitter();

  private lng: number;
  private lat: number;
  reverseGeocode: boolean=false;

  constructor(public api: ApiService,
              public toast:MatSnackBar,
              public dialog:MatDialog,
              public route:ActivatedRoute,
              public _location:Location,
              public router: Router,
              public loc:LocService,
              public config:ConfigService) {

  }

  ngOnInit() {
    checkLogin(this.router);

    var t:any=this.route.snapshot.queryParamMap.get("tags");
    if(t!=null)this.tags=t.split(",");

    this.anonymous=(this.route.snapshot.queryParamMap.get("anonymous")!="false");
    if(!this.anonymous)this._public=true;

    this.showOnMap();
  }

  add() {
    var tags:any=this.tags;
    if(typeof tags=="string")tags=tags.split(",");

    const owner = localStorage.getItem('user');
    this.api.addshop(this.shopname, this.address, this._public,owner,this.lng,this.lat,tags.join(","),this.website).subscribe((result: any) => {
      this.oninsert.emit({message:result.message});
      this.router.navigate(['home'],{queryParams:{message:result.message}});
    },(error)=>{showError(this,error);});
  }

  cancel(){
    this._location.back();
    //this.router.navigate(['home'],{queryParams:{message:"Enseigne non créée"}});
  }

  refresh_map(){
    clearTimeout(this.handle);
    this.handle=setTimeout(()=>{
      var l=getMarkerLayer(this.map);
      //var features=l.getSource().getFeatures();
      var center_pos=ol.proj.toLonLat(this.map.getView().getCenter());
      this.lng=center_pos[0];
      this.lat=center_pos[1];
      if(this.reverseGeocode){
        this.loc.getAddressFromCoord(this.lat,this.lng,(res)=>{
          this.reverseGeocode=false;
          if(res.display_name){
            this.shopname="";
            "kindergarten,building,pub,hairdresser,supermarket,bar".split(",").forEach((type)=>{
              if(res.address[type]!=null)this.shopname=res.address[type];
            });
            var house_number=res.address.house_number;
            if(house_number==null && this.shopname!=null)house_number=this.shopname;

            if(res.address.road==null)
              this.address=res.display_name;
            else
              this.address=(normeString(house_number)+", "+res.address.road+", "+res.address.postcode+" "+res.address.city).trim();
          }
        },null);
      }
      l.getSource().clear();
      l.getSource().addFeature(createMarker(center_pos[0], center_pos[1],this.config.values.icon_shop,null,0.2));
    },500);
  }


  showOnMap(zoom=15) {
    this.loc.getAddress(this.address,(res)=> {
      this.lng=Number(res[0].lon);
      this.lat= Number(res[0].lat);
      this.show_address=res[0].display_name;
      if(this.map==null){
        this.map =createMap({lng:this.lng,lat:this.lat},this.config.values.icon_shop,zoom,0.2,(event)=>{
          //Déplacement de la carte
          this.refresh_map();
        });
      }
      else{
        this.map.getView().setCenter(ol.proj.fromLonLat([this.lng, this.lat]));
        getMarkerLayer(this.map).addFeature(createMarker(this.lng, this.lat,this.config.values.icon_shop,null,0.2));
      }
    });
  }


  localize() {
    this.loc.getPosition().then((pos:any)=>{
      this.lng=pos.lng;
      this.lat=pos.lat;
      this.reverseGeocode=true;
      this.map.getView().setCenter(ol.proj.fromLonLat([this.lng, this.lat]));
      this.refresh_map();
    },()=>{
      this.toast.open("Vous avez désactivé la localisation",null,{duration:2000});
    });
  }


  checkLogin() {
    if(this.anonymous){
      this.toast.open("Seul les comptes enregistrés peuvent rendre leurs promotions 'public'","Se connecter",{duration:2000})
        .onAction().subscribe(()=>{
          this._location.back();
      });
      setTimeout(()=>{
        this._public=false;
      },1500);
    }
  }
}

import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ApiService} from '../api.service';
import {
  $$,
  checkLogin,
  createMap,
  createMarker,
  getMarkerLayer, isLocal,
  loginWithEmail,
  normeString,
  selectFile,
  showError
} from '../tools';
import {ActivatedRoute, Router} from '@angular/router';
import { Location } from '@angular/common';
import {LocService} from "../loc.service";
import {ConfigService} from "../config.service";
import {MatDialog, MatSnackBar} from "@angular/material";
import {ImageSelectorComponent} from "../image-selector/image-selector.component";
import {BreakpointObserver, BreakpointState} from "../../../node_modules/@angular/cdk/layout";

declare var ol: any;

@Component({
  selector: 'app-newshop',
  templateUrl: './newshop.component.html',
  styleUrls: ['./newshop.component.css']
})

export class NewshopComponent implements OnInit {
  new_shop={
    "name":"",
    "public":false,
    "address":"paris, france",
    "website":"",
    "owner":"",
    "picture":"",
    "lng":0,
    "lat":0,
    "tags":""
  };

  show_address="";
  focusElt="";
  anonymous=true;
  map: any;
  handle:any;
  iframe_src="https://web.reducshare.com/faqs/init_shop.html";
  showHelpScreen=false;

  @Output('insert') oninsert: EventEmitter<any>=new EventEmitter();


  reverseGeocode: boolean=false;
  canUpdateName: boolean=true;

  constructor(public api: ApiService,
              public toast:MatSnackBar,
              public dialog:MatDialog,
              public route:ActivatedRoute,
              public _location:Location,
              public breakpointObserver:BreakpointObserver,
              public router: Router,
              public loc:LocService,
              public config:ConfigService) {
    breakpointObserver
      .observe('(max-width: 950px)')
      .subscribe((state: BreakpointState) => {
        if (state.matches) {
          this.showHelpScreen = false;
        } else {
          this.showHelpScreen = true;
        }
      });
  }

  ngOnInit() {
    checkLogin(this.router);

    var params=this.route.snapshot.queryParamMap;
    this.anonymous=(params.get("anonymous")!="false");
    this.new_shop.owner=(params.get("userid"));
    if(params.get("edit")!=null){
      this.new_shop=this.api.shop;
      this.new_shop.tags=this.api.shop.tags.split(",");
    }
    else {
      var t:any=this.route.snapshot.queryParamMap.get("tags");
      if(t!=null){
        this.new_shop.tags=t.split(",");
      }
    }
    if(params.get("pseudo") && params.get("edit")==null)this.new_shop.name="Chez "+params.get("pseudo");
    if(!this.anonymous)this.new_shop.public=true;

    this.showOnMap();
  }

  add() {
    var tags:any=this.new_shop.tags;
    if(typeof tags=="string")tags=tags.split(",");

    this.new_shop.tags=tags.join(",");
    const owner = localStorage.getItem('user');
    this.api.addshop(this.new_shop).subscribe((result: any) => {
      this.oninsert.emit({message:result.message});
      this.router.navigate(['home'],{queryParams:{message:result.message}});
    },(error)=>{showError(this,error);});
  }

  cancel(){
    this._location.back();
  }

  refresh_map(){
    clearTimeout(this.handle);
    if(!this.new_shop.address.startsWith("http")){
      this.handle=setTimeout(()=>{
        var l=getMarkerLayer(this.map);
        //var features=l.getSource().getFeatures();
        var center_pos=ol.proj.toLonLat(this.map.getView().getCenter());
        this.new_shop.lng=center_pos[0];
        this.new_shop.lat=center_pos[1];
        if(this.reverseGeocode){
          this.loc.getAddressFromCoord(this.new_shop.lat,this.new_shop.lng,(res)=>{
            this.reverseGeocode=false;
            if(res.display_name){
              "kindergarten,building,pub,hairdresser,supermarket,bar".split(",").forEach((type)=>{
                if(res.address[type]!=null && this.canUpdateName)this.new_shop.name=res.address[type];
              });
              var house_number=res.address.house_number;
              if(house_number==null && this.new_shop.name!=null)house_number=this.new_shop.name;

              if(res.address.road==null)
                this.new_shop.address=res.display_name;
              else
                this.new_shop.address=(normeString(house_number)+", "+res.address.road+", "+res.address.postcode+" "+res.address.city).trim();
            }
          },null);
        }
        l.getSource().clear();
        l.getSource().addFeature(createMarker(center_pos[0], center_pos[1],this.config.values.icon_shop,null,0.2));
      },500);
    }
  }


  showOnMap(zoom=15) {
    $$("Refresh map pour address="+this.new_shop.address);
    if(!this.new_shop.address.startsWith('http')){
      this.loc.getAddress(this.new_shop.address,(res)=> {
        this.new_shop.lng=Number(res[0].lon);
        this.new_shop.lat= Number(res[0].lat);
        this.show_address=res[0].display_name;
        if(this.map==null){
          this.map =createMap({lng:this.new_shop.lng,lat:this.new_shop.lat},this.config.values.icon_shop,zoom,0.2,
            (event)=>{
              this.refresh_map();
            },
            null,
            (event)=>{
              this.map.getView().setCenter(event.coordinate);
            });
        }else{
          this.map.getView().setCenter(ol.proj.fromLonLat([this.new_shop.lng, this.new_shop.lat]));
          getMarkerLayer(this.map).addFeature(createMarker(this.new_shop.lng, this.new_shop.lat,this.config.values.icon_shop,null,0.2));
        }
      });
    }
  }


  localize() {
    this.loc.getPosition().then((pos:any)=>{
      this.new_shop["lng"]=pos.lng;
      this.new_shop["lat"]=pos.lat;
      this.reverseGeocode=true;
      this.map.getView().setCenter(ol.proj.fromLonLat([this.new_shop.lng, this.new_shop.lat]));
      this.refresh_map();
    },()=>{
      this.toast.open("Vous avez désactivé la localisation",null,{duration:2000});
    });
  }


  checkLogin() {
    if(this.anonymous && !isLocal()){
      this.toast.open("Vous devez vous enregistrer pour pouvoir rendre vos promotions visibles sur la carte des promotions localisées","Se connecter",{duration:6000})
        .onAction().subscribe(()=>{
          this._location.back();
      });
      setTimeout(()=>{
        this.new_shop.public=false;
      },1500);
    }
  }

  addImage() {
    this.dialog.open(ImageSelectorComponent, {position:{left:'5vw',top:'10vh'}, width: '90vw', height:'80vh',maxWidth:"400px",maxHeight:"500px",data: {result:this.new_shop.picture,width: '300px',height:'300px'}}).afterClosed().subscribe((result) => {
      if(result)
        this.new_shop.picture=result;
    });
  }
}

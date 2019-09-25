import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {ApiService} from '../api.service';
import {checkLogin, createMarker} from '../tools';
import { Router} from '@angular/router';
import {LocService} from "../loc.service";

declare var ol: any;

@Component({
  selector: 'app-newshop',
  templateUrl: './newshop.component.html',
  styleUrls: ['./newshop.component.css']
})

export class NewshopComponent implements OnInit {
  shopname = 'La maison du piano';
  address = '12, rue martel, paris 10';
  owner = '';
  map: any;
  marker:any;

  @Output('insert') oninsert: EventEmitter<any>=new EventEmitter();
  private lng: number;
  private lat: number;

  constructor(public api: ApiService, public router: Router,public loc:LocService) {

  }

  showMap(lat,lon){

    this.marker=createMarker(ol,lon,lat,"https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/google/223/shopping-trolley_1f6d2.png");

    this.map = new ol.Map({
      target: 'map',
      layers: [
        new ol.layer.Tile({
          source: new ol.source.OSM()
        }),
        new ol.layer.Vector({
          source: new ol.source.Vector({
            features: [
              this.marker
            ]
          }),
        })
      ],
      view: new ol.View({
        center: ol.proj.fromLonLat([lon, lat]),
        zoom: 19
      })
    });
  }

  ngOnInit() {
    checkLogin(this.router);
    this.showMap(48,2);
    this.showOnMap();
  }

  add() {
    const owner = localStorage.getItem('user');
    this.api.addshop(this.shopname, this.address, owner,this.lng,this.lat).subscribe((result: any) => {
      this.oninsert.emit({message:result.message});
      this.router.navigate(['home'],{queryParams:{message:result.message}});
    });
  }

  cancel(){
    this.router.navigate(['home'],{queryParams:{message:"Enseigne non créée"}});
  }

  showOnMap() {
    this.loc.getAddress(this.address,(res)=> {
      var view = this.map.getView();
      this.lng=Number(res[0].lon);
      this.lat= Number(res[0].lat);
      view.setCenter(ol.proj.fromLonLat([this.lng,this.lat]));
      var lonLat = this.map.LonLat(this.lng, this.lat);
      this.marker.setPosition(lonLat);
      this.address=res[0].display_name;
    });
  }


}

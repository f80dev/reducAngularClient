import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {ApiService} from '../api.service';
import {checkLogin, createMap, createMarker, getMarkerLayer} from '../tools';
import { Router} from '@angular/router';
import {LocService} from "../loc.service";
import {ConfigService} from "../config.service";

declare var ol: any;

@Component({
  selector: 'app-newshop',
  templateUrl: './newshop.component.html',
  styleUrls: ['./newshop.component.css']
})

export class NewshopComponent implements OnInit {
  shopname = 'La maison du piano';
  address = '12, rue martel, paris 10';
  show_address="";
  owner = '';
  map: any;
  handle:any;

  @Output('insert') oninsert: EventEmitter<any>=new EventEmitter();
  private lng: number;
  private lat: number;

  constructor(public api: ApiService, public router: Router,public loc:LocService,public config:ConfigService) {
  }



  ngOnInit() {
    checkLogin(this.router);
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
      this.lng=Number(res[0].lon);
      this.lat= Number(res[0].lat);
      this.show_address=res[0].display_name;
      if(this.map==null)
        this.map =createMap({lng:this.lng,lat:this.lat},this.config.values.icon_shop,18,()=>{
          clearTimeout(this.handle);
          this.handle=setTimeout(()=>{
            var l=getMarkerLayer(this.map);
            //var features=l.getSource().getFeatures();
            var center_pos=ol.proj.toLonLat(this.map.getView().getCenter());
            this.lng=center_pos[0];
            this.lat=center_pos[1];
            l.getSource().clear();
            l.getSource().addFeature(createMarker(center_pos[0], center_pos[1],this.config.values.icon_shop));
          },500);
        });
      else{
        this.map.getView().setCenter(ol.proj.fromLonLat([this.lng, this.lat]));
        getMarkerLayer(this.map).addFeature(createMarker(this.lng, this.lat,this.config.values.icon_shop));
      }

    });
  }


}

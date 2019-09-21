import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {ApiService} from '../api.service';
import {checkLogin} from '../tools';
import { Router} from '@angular/router';
import {LocService} from "../loc.service";

declare var ol: any;

@Component({
  selector: 'app-newshop',
  templateUrl: './newshop.component.html',
  styleUrls: ['./newshop.component.css']
})

export class NewshopComponent implements OnInit {
  shopname = 'La maison du serpent';
  address = '12, rue martel, paris 10';
  owner = '';
  map: any;
  marker = new ol.Feature({
    geometry: new ol.geom.Point([48,2]) // dont worry about coordinate type 0,0 will be in west coast of africa
  });

  @Output('insert') oninsert: EventEmitter<any>=new EventEmitter();

  constructor(public api: ApiService, public router: Router,public loc:LocService) {

  }

  showMap(lat,lon){
    this.map = new ol.Map({
      target: 'map',
      layers: [
        new ol.layer.Tile({
          source: new ol.source.OSM()
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

    var source = new ol.source.Vector({});
    var layer = new ol.layer.Vector({ source: source});
    this.map.addLayer(layer );

    source.addFeature(this.marker);
  }

  add() {
    const owner = localStorage.getItem('user');
    this.api.addshop(this.shopname, this.address, owner).subscribe((result: any) => {
      this.oninsert.emit({message:result.message});
      this.router.navigate(['home'],{queryParams:{message:result.message}});
    });
  }

  showOnMap() {
    this.loc.getAddress(this.address,(res)=> {
      var view = this.map.getView();
      view.setCenter(ol.proj.fromLonLat([Number(res[0].lon), Number(res[0].lat)]));
      var lonLat = this.map.LonLat(Number(res[0].lon), Number(res[0].lat))

      this.address=res[0].display_name;
    });
  }
}

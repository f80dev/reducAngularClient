import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocService {

  constructor() { }

  getPosition(): Promise<any> {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resp => {
          resolve({lng: resp.coords.longitude, lat: resp.coords.latitude});
        },
        err => {
          reject(err);
        });
    });

  }

  public getAddressFromCoord(lat:number,lng:number,func_success:Function,func_failed:Function=null){
    var url="https://nominatim.openstreetmap.org/reverse?lat="+lat+"&lon="+lng;
    url+="&format=json&addressdetails=0";
    fetch(url).then((r)=> { return r.json(); }).then((resp)=>{
      func_success(resp);
    }).catch((err)=>{
        if(func_failed!=null)func_failed(err);
      }
    );
  }

  public getAddress(query:string,func_success:Function,func_failed:Function=null,verb="search"){
    var url="https://nominatim.openstreetmap.org/"+verb+"?q="+encodeURI(query);
    url+="&format=json&addressdetails=1";
    fetch(url).then((r)=> { return r.json(); }).then((resp)=>{
      func_success(resp);
    }).catch((err)=>{
        if(func_failed!=null)func_failed(err);
      }
    );
  }
}

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

  public getAddress(query:string,func_success:Function,func_failed:Function=null){
    var url="https://nominatim.openstreetmap.org/search?q="+encodeURI(query);
    url+="&format=json&addressdetails=1";
    fetch(url).then((r)=> { return r.json(); }).then((resp)=>{
      func_success(resp);
    }).catch((err)=>{
        if(func_failed!=null)func_failed(err);
      }
    );
  }
}

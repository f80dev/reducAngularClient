import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocService {

  constructor() { }


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

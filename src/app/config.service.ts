import { Injectable } from '@angular/core';
import {HttpClient} from '../../node_modules/@angular/common/http';
import { Location } from '@angular/common';
import {environment} from '../environments/environment';
import {initAvailableCameras} from "./tools";

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  visibleTuto=false;
  values:any={};
  config:any=null;
  waiting:boolean=false;
  webcamsAvailable:number=0;

  constructor(private location: Location, private http: HttpClient){}

  async logo(): Promise<string> {
    let conf = await this.getConfig();
    return Promise.resolve(conf.logo);
  }

  init(func=null){

    initAvailableCameras((res)=>{
      this.webcamsAvailable=res;
    });

    this.getConfig().then(r=>{
      this.values=r;
      if(func!=null)func(this.values);
    });
  }

  private async getConfig(): Promise<any> {
    if (!this.config) {
      this.config = (await this.http.get(this.location.prepareExternalUrl(environment.config_file)).toPromise());
    }
    return Promise.resolve(this.config);
  }
}

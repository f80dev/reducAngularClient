import { Injectable } from '@angular/core';
import {HttpClient} from '../../node_modules/@angular/common/http';
import { Location } from '@angular/common';
import {environment} from '../environments/environment';
import {initAvailableCameras} from "./tools";
import {Platform} from "@angular/cdk/platform";

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  visibleTuto=false;
  values:any={};
  config:any=null;
  waiting:boolean=false;
  webcamsAvailable:number=0;
  width_screen=300;
  params:any=null;
  flips=[];


  constructor(private location: Location, private http: HttpClient,public platform:Platform){

  }

  async logo(): Promise<string> {
    let conf = await this.getConfig();
    return Promise.resolve(conf.logo);
  }


  /**
   * Initialisation des principaux paramètres
   * @param func
   */
  init(func=null){

    this.width_screen=screen.availWidth;

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

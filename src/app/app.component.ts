import { Component } from '@angular/core';
import {ConfigService} from './config.service';
import {Meta} from "@angular/platform-browser";
import {fixTagPage} from "./tools";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'reducClient';

  constructor(public config:ConfigService,public meta:Meta){
    config.init();
    fixTagPage(meta,{url:"",label:"mon label",picture:"https://reducshare.com/assets/img/discount.png"});
  }
}

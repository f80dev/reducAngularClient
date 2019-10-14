import { Component, OnInit } from '@angular/core';
import {ConfigService} from "../config.service";

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {

  constructor(public config:ConfigService) { }

  visible=false;

  ngOnInit() {
    this.visible=(localStorage.getItem("about")=="true");
  }

  switchVisible() {
    this.visible=!this.visible;
    localStorage.setItem("about",this.visible.toString());
  }
}

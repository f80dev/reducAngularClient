import { Component, OnInit } from '@angular/core';
import {ConfigService} from "../config.service";

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {

  constructor(public config:ConfigService) { }

  ngOnInit() {
  }

}

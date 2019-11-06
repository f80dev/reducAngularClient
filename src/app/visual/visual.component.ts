import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-visual',
  templateUrl: './visual.component.html',
  styleUrls: ['./visual.component.css']
})
export class VisualComponent implements OnInit {

  @Input("picture") picture="";
  @Input("src") src="";
  @Input("width") w:string="";
  @Input("height") h:string="";

  @Input("crop") crop:string="";

  @Input("max-width") mw:string="";
  @Input("max-height") mh:string="";


  constructor() { }

  ngOnInit() {
    if(this.picture=="")this.picture=this.src;
  }

}

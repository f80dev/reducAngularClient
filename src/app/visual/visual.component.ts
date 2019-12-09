import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-visual',
  templateUrl: './visual.component.html',
  styleUrls: ['./visual.component.css']
})
export class VisualComponent implements OnInit {

  fontsize="";
  @Input("picture") picture="";
  @Input("src") src="";
  @Input("flat") flat=false;
  @Input("width") w:string="";
  @Input("height") h:string="";
  @Input("size") size=50;

  @Input("crop") crop:string="";
  @Input("radius") radius:string="";

  @Input("max-width") mw:string="";
  @Input("max-height") mh:string="";


  constructor() { }

  ngOnInit() {
    if(this.w=="" || this.h==""){
      this.w=this.size+"px";
      this.h=this.size+"px";
    }

    if(this.picture=="")this.picture=this.src;
    if(this.fontsize=="")this.fontsize=this.size*0.9+"px";
  }

}

import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-visual',
  templateUrl: './visual.component.html',
  styleUrls: ['./visual.component.css']
})
export class VisualComponent implements OnInit {

  @Input("picture") picture="";
  @Input("size") size:string="150px";
  @Input("width") w:string="";
  @Input("height") h:string="";

  constructor() { }

  ngOnInit() {
    if(!this.size.endsWith("px"))this.size=this.size+"px";
    if(this.w==null)this.w=this.size;
    if(this.h==null)this.h=this.size;
    this.w=""+this.w;
    this.h=""+this.h;
    if(!this.w.endsWith("px"))this.w=this.w+"px";
    if(!this.h.endsWith("px"))this.h=this.h+"px";
  }

}

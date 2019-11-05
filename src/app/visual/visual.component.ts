import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-visual',
  templateUrl: './visual.component.html',
  styleUrls: ['./visual.component.css']
})
export class VisualComponent implements OnInit {

  @Input("picture") picture="";
  @Input("width") w:string="";
  @Input("height") h:string="";

  @Input("max-width") mw:string="";
  @Input("max-height") mh:string="";


  constructor() { }

  ngOnInit() {

  }

}

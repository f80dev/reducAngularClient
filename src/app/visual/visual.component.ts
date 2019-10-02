import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-visual',
  templateUrl: './visual.component.html',
  styleUrls: ['./visual.component.css']
})
export class VisualComponent implements OnInit {

  constructor() { }

  @Input("picture") picture="";

  ngOnInit() {
  }

}

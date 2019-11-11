import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ConfigService} from "../config.service";

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {

  constructor(public config:ConfigService) { }

  visible=false;
  @Input("user") user:any;
  @Input("withlogo") withlogo=true;
  @Input("logosize") logosize="150px";
  @Output('open') onopen: EventEmitter<any>=new EventEmitter();

  ngOnInit() {
    this.visible=(localStorage.getItem("about")=="true");
  }

  switchVisible() {
    this.visible=!this.visible;
    localStorage.setItem("about",this.visible.toString());
  }

  openFrame(url:string,forceOpen=false){
    this.onopen.emit({url:url,forceOpen:forceOpen});
  }

}

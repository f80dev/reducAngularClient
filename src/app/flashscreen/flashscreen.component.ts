import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {ConfigService} from "../config.service";

@Component({
  selector: 'app-flashscreen',
  templateUrl: './flashscreen.component.html',
  styleUrls: ['./flashscreen.component.css']
})
export class FlashscreenComponent implements OnInit {
  private timer: any;

  constructor(public config:ConfigService) { }

  @Input("duration") duration:number=5;
  @Input("message") message:string="";
  submessage:string="";
  @Input("delay") delay:number=0.2;
  @Input("logo") logo:string="./assets/img/Gift.gif";
  @Output('close') onclose: EventEmitter<any>=new EventEmitter();

  close(){
    clearTimeout(this.timer);
    this.config.visibleTuto=false;
    this.onclose.emit();
  }

  ngOnInit(): void {
    this.config.visibleTuto=true;
    if(this.message!=null){
      if(this.message.startsWith("#"))this.message=this.message.substr(1);
      if(this.message.indexOf("#submessage#")>-1)this.submessage=this.message.split("#submessage#")[1];
      this.message=this.message.split("#submessage#")[0];

      this.timer=setTimeout(()=>{
        this.close();
      },this.duration*1000)
    }
  }

}

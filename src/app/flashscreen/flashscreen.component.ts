import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';

@Component({
  selector: 'app-flashscreen',
  templateUrl: './flashscreen.component.html',
  styleUrls: ['./flashscreen.component.css']
})
export class FlashscreenComponent implements OnInit {
  private timer: any;

  constructor() { }

  @Input("duration") duration:number=5;
  @Input("message") message:string="";
  @Input("submessage") submessage:string="";
  @Input("delay") delay:number=0.2;
  @Input("logo") logo:string="./assets/img/Gift.gif";
  @Output('close') onclose: EventEmitter<any>=new EventEmitter();

  localMessage:string="";

  close(){
    clearTimeout(this.timer);
    this.onclose.emit();
  }

  ngOnInit(): void {
    this.localMessage=""+this.message;
    if(this.message!=null){
      if(this.message.startsWith("#"))this.message=this.message.substr(1);
      this.timer=setTimeout(()=>{
        this.close();
      },this.duration*1000)
    }
  }

}
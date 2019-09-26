import {Component, Input, OnChanges, OnInit} from '@angular/core';
import {hashCode} from '../tools';
import {ConfigService} from "../config.service";

@Component({
  selector: 'app-tuto',
  templateUrl: './tuto.component.html',
  styleUrls: ['./tuto.component.css']
})
export class TutoComponent implements OnChanges,OnInit {

  @Input("text") text: string="";
  @Input("type") _type: string="";
  @Input("label") label: string="";
  @Input("subtitle")subtitle: string="";
  @Input("delay") delay=0.2;
  @Input("duration") duration=0;
  @Input('if') _if: boolean=true;
  @Input('image') image: string="./assets/img/tips.png";
  @Input('icon') icon:string="";

  constructor(public config:ConfigService) {}

  ngOnChanges() {
    setTimeout(()=>{
      if(this.text==null || this.text.length==0)this.text=this.label;
      if(this._if && !this.config.visibleTuto){
        let code=hashCode(this.text);
        let res=localStorage.getItem(code);
        if(res==null){
          this.config.visibleTuto=true;
          localStorage.setItem(code,"read"+new Date().getTime());

          if(this.duration==0)this.duration=this.text.split(" ").length*0.8;

          setTimeout(()=>{
            this.text="";
            this.config.visibleTuto=false;
          },3000+this.duration*1000);
        } else {
          this.config.visibleTuto=false;
          this.text="";
        }
      } else {
        this.text="";
      }
    },this.delay*1000);
  }

  hideTuto() {
    this.text="";
  }

  ngOnInit(): void {
    if(this.subtitle.length>0)this._type="title";
    if(this.icon!=null && this.icon.length>0)this.image="";
    if(this._type=="tips"){
      this._if=false;
    }
  }

  showText(b: boolean) {
    this._if=b;
    this.ngOnChanges();
  }
}

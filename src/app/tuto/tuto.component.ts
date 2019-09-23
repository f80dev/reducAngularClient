import {Component, Input, OnInit} from '@angular/core';
import {hashCode} from '../tools';
import {ConfigService} from "../config.service";

@Component({
  selector: 'app-tuto',
  templateUrl: './tuto.component.html',
  styleUrls: ['./tuto.component.css']
})
export class TutoComponent implements OnInit {

  @Input("text") text: string="";
  @Input("label") label: string="";
  @Input("delay") delay=0.1;
  @Input('if') _if: boolean=true;

  constructor(public config:ConfigService) {}

  ngOnInit() {
    setTimeout(()=>{
      if(this.text==null || this.text.length==0)this.text=this.label;
      if(this._if && !this.config.visibleTuto){
        let code=hashCode(this.text);
        let res=localStorage.getItem(code);
        if(res==null){
          this.config.visibleTuto=true;
          localStorage.setItem(code,"read"+new Date().getTime());
          let duration=this.text.split(" ").length*800;
          setTimeout(()=>{
            this.text="";
            this.config.visibleTuto=false;
          },3000+duration);
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
}

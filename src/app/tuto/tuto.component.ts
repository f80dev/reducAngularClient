import {Component, Input, OnChanges, OnInit} from '@angular/core';
import {hashCode} from '../tools';
import {ConfigService} from "../config.service";
import {TransPipe} from "../trans.pipe";

@Component({
  selector: 'app-tuto',
  templateUrl: './tuto.component.html',
  styleUrls: ['./tuto.component.css']
})
export class TutoComponent implements OnChanges,OnInit {

  @Input("text") text: string="";
  @Input("title") title: string="";
  @Input("type") _type: string="";
  @Input("label") label: string="";
  @Input("subtitle")subtitle: string="";
  @Input("delay") delay=0.2;
  @Input("duration") duration=0;
  @Input('if') _if: boolean=true;
  @Input('image') image: string="./assets/img/tips.png";
  @Input('icon') icon:string="";
  @Input('force') force:boolean=false;
  @Input('button') _button:string="";
  @Input('height') height:string="auto";

  constructor(public config:ConfigService,public transPipe:TransPipe) {}

  handle:any;

  ngOnChanges() {
    if(this._if){
      setTimeout(()=>{
        if(this.text==null || this.text.length==0)this.text=this.label;
        if(this.title!=null && this.title.length>0){
          this._type="title";
          this.text=this.title;
        }
        this.text=this.transPipe.transform(this.text);
        let code="histo"+hashCode(this.text+this.subtitle);

        if(this.duration==-1)this.duration=(this.text.split(" ").length+this.subtitle.split(" ").length)/3;

        let res=localStorage.getItem(code);
        if((res==null || this.force) && !this.config.visibleTuto){
          this.config.visibleTuto=true;
          localStorage.setItem(code,"read"+new Date().getTime()); //Marque l'affichage

          if(this.duration>0){
            this.handle=setTimeout(()=>{this.hideTuto();},3000+this.duration*1000);
          }
        } else {
          this.hideTuto();
        }
      },this.delay*1000);
    } else {
      this.config.visibleTuto=false;
      this.text="";
    }
  }

  hideTuto() {
    this.text="";
    this.subtitle="";
    this.config.visibleTuto=false;
    clearTimeout(this.handle);
  }

  ngOnInit(): void {
    if(this.subtitle.length>0)this._type="title";
    if(this.icon!=null && this.icon.length>0)this.image="";
    if(this._button!=null && this._button.length>0)this.image="";
    if(this._type=="tips"){
      this._if=false;
    }
  }

  showText(b: boolean) {
    this._if=b;
    this.ngOnChanges();
  }
}

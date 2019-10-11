import {Component, Input, OnChanges, OnInit} from '@angular/core';
import {$$, hashCode} from '../tools';
import {TransPipe} from "../trans.pipe";
import {ConfigService} from "../config.service";

@Component({
  selector: 'app-tuto',
  templateUrl: './tuto.component.html',
  styleUrls: ['./tuto.component.css']
})
export class TutoComponent implements OnChanges,OnInit {

  @Input("text") text: string="";
  @Input("title") title: string="";
  @Input("type") _type: string="tips";
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
  code:string="";

  refresh(){

    if(!this.config.visibleTuto || this._type=="title"){
      if(this._if){
          this.config.visibleTuto=true;
          localStorage.setItem(this.code,"read"+new Date().getTime()); //Marque l'affichage
          this.handle=setTimeout(()=>{
            this.hideTuto();
          },3000+this.duration*1000);
      } else {
        this.hideTuto();
      }
    } else this.hideTuto();

  }

  ngOnChanges() {

  }

  hideTuto() {
    this.text="";
    this._if=false;
    this.config.visibleTuto=false;
    this.title="";
    this.subtitle="";
    clearTimeout(this.handle);
  }

  ngOnInit(): void {

    if(this.icon!=null && this.icon.length>0)this.image="";
    if(this._button!=null && this._button.length>0)this.image="";

    if(this.text==null || this.text.length==0)this.text=this.label;
    if(this.title!=null && this.title.length>0){
      this._type="title";
      this.text=this.title;
    }
    if(this.subtitle.length>0)this._type="title";

    this.text=this.transPipe.transform(this.text);
    $$("Analyse de "+this.text);

    this.code="histo"+hashCode(this.text+this.subtitle);
    if(localStorage.hasOwnProperty(this.code)){
      this._if=false;
    }
    else{

    }

    if(this.duration==0)this.duration=(this.text.split(" ").length+this.subtitle.split(" ").length)/2;
    this.refresh();

  }

  showText(b: boolean) {
    this._if=b;
    this.ngOnChanges();
  }
}

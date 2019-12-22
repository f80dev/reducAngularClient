import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.css']
})
export class TimerComponent implements OnInit {

  @Input("end") dtEnd:number=new Date().getTime()/1000;
  @Input("short") short:boolean=false;
  @Input("showAfter") showAfter:boolean=false;
  dateToShow:string="";
  delayInHour:number=0;

  constructor() { }

  refresh(){
    var delay=Math.abs(this.dtEnd*1000-new Date().getTime())/1000;
    this.delayInHour=Math.trunc(delay/3600);
    var delayInDay=Math.trunc(delay/(24*3600));
    var delayInMinutes=Math.trunc(delay/60);
    var sec=""+Math.trunc((delay-delayInMinutes*60) % 60);
    if(sec.length==1)sec="0"+sec;
    this.dateToShow=delayInMinutes+":"+sec;
    if(this.delayInHour>1)this.dateToShow=this.delayInHour+" heures"
    if(this.delayInHour>=48)this.dateToShow=delayInDay+" jours";

    if(this.short){
      this.dateToShow=this.dateToShow.replace("jours","jrs").replace("heures","hrs");
    }

    if(delay<0 && !this.showAfter)this.dateToShow="";
  }

  ngOnInit() {
    this.refresh();

    if(this.delayInHour<10) //Si le delai est long on ne met pas en place un timer
      setInterval(()=>{this.refresh();},1000);
  }

}

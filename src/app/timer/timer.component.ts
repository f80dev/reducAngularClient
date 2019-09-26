import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.css']
})
export class TimerComponent implements OnInit {

  @Input("end") dtEnd:number=0;
  dateToShow:string="";

  constructor() { }

  ngOnInit() {
    setInterval(()=>{
      var delay=(this.dtEnd*1000-new Date().getTime())/1000;
      var delayInHour=Math.trunc(delay/3600);
      var delayInDay=Math.trunc(delay/(24*3600));
      var delayInMinutes=Math.trunc(delay/60);
      var sec=""+Math.trunc((delay-delayInMinutes*60) % 60);
      if(sec.length==1)sec="0"+sec;
      this.dateToShow=delayInMinutes+":"+sec;
      if(delayInHour>1)this.dateToShow=delayInHour+" heures"
      if(delayInHour>=48)this.dateToShow=delayInDay+" jours";

    },1000);
  }

}

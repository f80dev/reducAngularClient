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
      var delay=(this.dtEnd-new Date().getTime())/1000;
      var delayInHour=Math.trunc(delay/3600);
      var delayInDay=Math.trunc(delay/(24*3600));
      this.dateToShow=(delayInHour*60)+" minutes";
      if(delayInHour>2)this.dateToShow=delayInHour+" heures"
      if(delayInHour>48)this.dateToShow=delayInDay+" jours";

    },1000);
  }

}

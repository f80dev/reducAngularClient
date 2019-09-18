import { Component, OnInit } from '@angular/core';
import {ApiService} from '../api.service';
import {ActivatedRoute, Router} from '@angular/router';
import {checkLogin} from '../tools';
import {Socket} from "ngx-socket-io";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  constructor(public socket:Socket,public api: ApiService, public router: Router, public route: ActivatedRoute) { }

  user: any = {message:""};

  ngOnInit() {
    this.refresh();
    this.socket.on("refresh",(data:any)=>{
      if(data.user==this.user._id){
        console.log("From server:" + data.message);
        this.refresh(data.message);
      }
    });
  }

  refresh(message:string="") {
    if (checkLogin(this.router, this.route.snapshot.queryParamMap)) {
      this.api.getuser(localStorage.getItem('user')).subscribe((u) => {
        this.user = u;
        this.user.message=message;
        //Effacer le message
        setTimeout(()=>{this.user.message=""},5000);

        console.log("user="+this.user._id)
      });
    }
  }

}

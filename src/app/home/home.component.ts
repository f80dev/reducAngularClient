import { Component, OnInit } from '@angular/core';
import {ApiService} from '../api.service';
import {ActivatedRoute, Router} from '@angular/router';
import {$$, checkLogin} from '../tools';
import {Socket} from "ngx-socket-io";
import {Location} from '@angular/common'
import {ConfigService} from "../config.service";
import {environment} from "../../environments/environment";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(public socket:Socket,
              public api: ApiService,
              public router: Router,
              public config:ConfigService,
              public _location:Location,
              public route: ActivatedRoute) { }

  showMessage: boolean=false;
  user: any = {message:""};
  coupons=[];

  analyse_login(func){
    $$("Analyse le device pour détecter les ancienes connexions")
    if(localStorage.getItem("user")==null || localStorage.getItem("user")=="undefined"){
      $$("C'est la premier connexion sur ce device, on créé un compte fictif");
      this.api.adduser("user"+new Date().getTime()+"@fictif.com","").subscribe((res)=>{
        func(res);
      })
    } else {
      this.api.getuser(localStorage.getItem('user')).subscribe((u:any) => {
        if(u.code==500){
          $$("Le compte stocker sur le device a été effacé de la base. On l'efface sur le device")
          localStorage.clear();
          this.analyse_login(func);
        } else {
          func(u);
        }
      });
    }
  }

  ngOnInit() {
    this.analyse_login((u)=>{
      localStorage.setItem("user",u._id);
      this.user = u;
      this.connect();
      this.refresh(this.route.snapshot.queryParamMap.get("message"));
    });
  }

  connect(){
    $$("Mise en place de la socket");
    this.socket.on("refresh",(data:any)=>{
      if(data.user==this.user._id){
        $$("Refresh depuis la socket avec "+data.message);
        setTimeout(()=>{this.refresh(data.message);},1500);
      }
    });

    this.route.params.subscribe((params)=>{
      var coupon=params["coupon"];
      if(coupon!=null){
        this._location.replaceState(this._location.path().split('?')[0], '');
        $$("Traitement du coupon",coupon);
        this.api.flash(this.user._id, coupon).subscribe((result:any) => {
          localStorage.setItem("showCoupon",result.newcoupon);
          this.refresh(result.message);
        });
      }

      var password=params["pass"];
      if(password!=null){
        if(localStorage.getItem("code")==password){
          localStorage.setItem("user",params["user"]);
        }
      }
    });
  }

  refresh(message="") {

    if(message==null)message="";

    this.api.getuser(localStorage.getItem('user')).subscribe((u) => {
      this.user=u;
      this.user.message=message;
      if(this.user.message.startsWith("#"))this.user.message=this.user.message.substr(1);
      if(message.startsWith("#")){
        setTimeout(()=>{
          this.showMessage=true;
        },2000);
      }

      //Effacer le message
      setTimeout(()=>{this.user.message=""},30000);

      if(this.user.coupons!=null){
        this.coupons=[];
        var i=0;
        this.user.coupons.forEach((coupon)=>{
          if(coupon.origin!=coupon._id){
            if(i==0)coupon.visible=true;
            this.coupons.push(coupon);
            i++;
          }
        });
      }
    });

  }

  closeFlashScreen() {
    this.showMessage=false;
  }

  updateUser(user) {
    if(localStorage.getItem("user")==user._id)
      this.refresh();
    else
      this.ngOnInit();
  }
}

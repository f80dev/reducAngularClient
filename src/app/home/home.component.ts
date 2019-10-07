import { Component, OnInit } from '@angular/core';
import {ApiService} from '../api.service';
import {ActivatedRoute, Router} from '@angular/router';
import {$$, checkLogin, showError} from '../tools';
import {MatDialog} from '@angular/material/dialog';
import {Socket} from "ngx-socket-io";
import {Location} from '@angular/common'
import {ConfigService} from "../config.service";
import {MatSnackBar} from "@angular/material";
import {LoginComponent} from "../login/login.component";
import {PromptComponent} from "../prompt/prompt.component";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(public socket:Socket,
              public api: ApiService,
              public toast:MatSnackBar,
              public router: Router,
              public dialog:MatDialog,
              public config:ConfigService,
              public _location:Location,
              public route: ActivatedRoute) { }

  showMessage: boolean=false;
  user: any = {message:""};
  coupons=[];

  analyse_params(func){
    var params=this.route.snapshot.queryParamMap;
    $$("Récupération des paramètres",params);
      this.config.params={
        coupon:params.get("coupon") || "",
        pass:params.get("pass") || "",
        tags:params.get("tags") || "",
        user:params.get("user") || "",
        map:params.get("map") || "",
      };

      if(this.config.params.coupon==""){
        var params2=this._location.path();
        if(params2.indexOf("/home/")>-1)this.config.params.coupon=params2.split("/home/")[1];
      }

      $$("Netoyage de l'url de lancement");
      var url=this._location.path();
      this._location.replaceState(url, '');

      func(this.config.params);
  }

  /**
   *
   * @param tags utilisé pour configurer l'utilisateur si création
   * @param func
   */
  analyse_login(tags,func){
    $$("Analyse le device pour détecter les ancienes connexions");
    if(localStorage.getItem("user")==null || localStorage.getItem("user")=="undefined"){
      $$("C'est la premier connexion sur ce device, on créé un compte fictif");
      this.api.adduser("user"+new Date().getTime()+"@fictif.com","",tags).subscribe((res)=>{
        func(res);
      },(error)=>{showError(this,error);})
    } else {
      this.api.getuser(localStorage.getItem('user')).subscribe((u:any) => {
        if(u.code==500){
          $$("Le compte stocker sur le device a été effacé de la base. On l'efface sur le device")
          localStorage.clear();
          this.analyse_login(tags,func);
        } else {
          func(u);
        }
      },(error)=>{showError(this,error);});
    }
  }

  ngOnInit() {
    this.analyse_params((p)=>{
      this.analyse_login(p.tags,(u)=>{
        localStorage.setItem("user",u._id);
        this.user = u;
        this.connect(p.coupon,p.pass);
        this.refresh(this.route.snapshot.queryParamMap.get("message"));
      });
    })
  }

  /**
   * Ouverture des sockets et récupération des paramètres
   */
  connect(coupon:any=null,pass:string=null,user:string=null){
    $$("Mise en place de la socket");
    this.socket.on("refresh",(data:any)=>{
      if(data.user==this.user._id){
        $$("Refresh depuis la socket avec "+data.message);
        setTimeout(()=>{this.refresh(data.message);},1500);
      }
    });



      if(coupon!=null && coupon!=""){
        $$("Traitement du coupon",coupon);
        this.api.flash(this.user._id, coupon).subscribe((result:any) => {
          localStorage.setItem("showCoupon",result.newcoupon);
          this.refresh(result.message);
        },(error)=>{showError(this,error);});
      }



      if(pass!=null && coupon!=""){
        if(localStorage.getItem("code")==pass){
          localStorage.setItem("user",user);
        }
      }
  }

  refresh(message="") {

    if(message==null)message="";

    this.api.getuser(localStorage.getItem('user')).subscribe((u) => {
      this.user=u;
      if(this.user.lastCGU<this.config.values.cgu.dtModif && this.user.email.indexOf("fictif.com")==-1){
        this.dialog.open(PromptComponent,{
          width:'90vw',data: {title:"Etes vous d'accord avec les CGU ?",
            question:this.config.values.cgu.content,
            onlyConfirm:true}})
          .afterClosed().subscribe((result:any) => {
            if(result=="yes") {
              this.user.lastCGU = new Date().getTime();
              this.api.setuser(this.user).subscribe(() => {
              });
            }
            else{
              this.router.navigate(["home"]);
            }
        });
      }
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
    },(error)=>{showError(this,error);});

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

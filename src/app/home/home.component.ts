import { Component, OnInit } from '@angular/core';
import {ApiService} from '../api.service';
import {ActivatedRoute, Router} from '@angular/router';
import {$$, showError, showMessage, traitement_coupon} from '../tools';
import {MatDialog} from '@angular/material/dialog';
import {Socket} from "ngx-socket-io";
import {Location} from '@angular/common'
import {ConfigService} from "../config.service";
import {MatSnackBar} from "@angular/material";
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
  sort="dtCreate";

  /**
   * Analyse des parametre de l'url
   * @param func
   */
  analyse_params(func){
    var params=this.route.snapshot.queryParamMap;
    localStorage.setItem("firsturl",this._location.path());
    $$("Récupération des paramètres",params);
    if(this.config.params==null){
      this.config.params={
        coupon:params.get("coupon") || "",
        pass:params.get("pass") || "",
        tags:params.get("tags") || "",
        tuto:true,
        command:params.get("command") || "",
        user:params.get("user") || "",
        map:params.get("map") || "",
        message:params.get("message") || "",
      };

      if(params.has("notuto"))this.config.params["tuto"]=false;

      if(this.config.params.coupon==""){
        var params2=this._location.path();
        if(params2.indexOf("/home/")>-1)this.config.params.coupon=params2.split("/home/")[1];
      }

      $$("Netoyage de l'url de lancement:"+this._location.path());
      this._location.replaceState(this._location.path().split('?')[0],"");
      this._location.replaceState(this._location.path().split('/home')[0],"");

    }


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
      localStorage.clear();
      $$("C'est la premier connexion sur ce device, on créé un compte fictif avec les tags="+tags);
      this.api.adduser("user"+new Date().getTime()+"@fictif.com","",tags).subscribe((res)=>{
        func(res,true);
      },(error)=>{showError(this,error);})
    } else {
      this.api.getuser(localStorage.getItem('user')).subscribe((u:any) => {
        if(u.code==500){
          $$("Le compte stocker sur le device a été effacé de la base. On l'efface sur le device")
          this.raz();
        } else {
          func(u,false);
        }
      },(error)=>{showError(this,error);});
    }
  }

  ngOnInit() {
    this.analyse_params((p)=>{
      this.analyse_login(p.tags,(u:any,isnew:boolean)=>{
        //if(isnew)p.message="Vous êtes vendeur ? créer votre première promotion. Vous êtes acheteur ? visualisez les promotions autour de vous !";
        localStorage.setItem("user",u._id);
        this.user = u;
        this.connect(p.coupon,p.pass);
        this.refresh(p.message);
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
        if(data.coupon!=null)localStorage.setItem("showCoupon",data.coupon);
        if(data.shop!=null)localStorage.setItem("showShop",data.shop);
        $$("Refresh depuis la socket avec "+data.message);
        setTimeout(()=>{this.refresh(data.message);},1500);
      }
    });


      if(coupon!=null && coupon!=""){
        $$("Traitement du coupon ",coupon);
        $$("Le user est ",this.user);
        this.api.flash(this.user._id, coupon).subscribe((result:any) => {
          localStorage.setItem("showCoupon",result.newcoupon);
          this.refresh(result.message);
        },(error)=>{showError(this,error);});
      }


      //http://localhost:4200/?pass=ZmRzZmRzQGdmZGprZ2QjIzVkYTFlNzI2YWQ3MDI0Y2FhMTRhNWQ3ZA==
    /*
      Analyse du lien de connexion avec email
     */
      if(pass!=null && pass.length>0 && this.user.email.indexOf("fictif.com")>-1){
        var new_mail=atob(pass).split("##")[0];
        var userid=atob(pass).split("##")[1];
        if(new_mail.indexOf("@")>-1){
          if(this.user._id==userid){
            this.user.email=new_mail;
            if(this.user.pseudo==null || this.user.pseudo.length==0) {
              this.user.pseudo = this.user.email.split("@")[0].replace("."," ").split(" ")[0];
            }
            this.api.setuser(this.user).subscribe(()=>{
              this.refresh("L'email "+new_mail+" à bien été ajouté à votre compte.");
            },(err)=>{showError(this,err);});
          } else {
            this.refresh("Impossible d'enregistrer le mail. Utiliser la connexion via Google ou Facebook (seul votre email sera récupéré par ReducShare)");
          }
        }
      }

      if(pass!=null && coupon!=""){
        if(localStorage.getItem("code")==pass){
          localStorage.setItem("user",user);
        }
      }
  }



  refresh(message:string="",sort="dtCreate") {

    this.sort=sort;

    if(message==null)message="";
    var user_id=localStorage.getItem('user');

    $$("Appel de refresh avec message="+message+". Récupération du compte "+user_id);
    this.api.getuser(user_id).subscribe((u:any) => {
      if(u==null || u._id==null){
        this.raz();
      }

      for(var k=0;k<u.coupons.length;k++){
        if(this.config.flips.indexOf(u.coupons[k]._id)>-1)
          u.coupons[k].flip=true;
        else
          u.coupons[k].flip=false;
      }

      this.user=u;
      for(var k=0;k<this.user.shops.length;k++)
        if(this.user.shops[k]._id==localStorage.getItem("showShop"))this.user.shops[k].visible=true;

      showMessage(this,message);

      if(this.user.email.indexOf("fictif.com")==-1){
        //Validation des CGUs
        if(this.user.lastCGU<this.config.values.cgu.dtModif && this.config.values.cgu.online){
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
              var id_old_user=localStorage.getItem("old_user");
              if(localStorage.getItem("user")==id_old_user)
                this.raz();
              else
                localStorage.setItem("user",id_old_user);

              this.refresh("Vous ne pouvez pas être authentifier sans valider les CGUs");
            }
          });
        }
      }
      //this.coupons=traitement_coupon(this.user.coupons,localStorage.getItem("showCoupon"));

    },(error)=>{showError(this,error);});

  }

  closeFlashScreen() {
    this.showMessage=false;
  }

  updateUser(user:any) {
    if(localStorage.getItem("user")==user._id)
      this.refresh();
    else
      this.ngOnInit();
  }

  private raz() {
    var url=localStorage.getItem("firsturl");
    localStorage.clear();
    window.location.href=url;
  }
}

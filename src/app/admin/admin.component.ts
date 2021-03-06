import { Component, OnInit } from '@angular/core';
import {ApiService} from "../api.service";
import {$$, openGraphForShop, showError} from "../tools";
import { Location } from '@angular/common';
import { Router} from '@angular/router';
import {ADMIN_PASSWORD} from "../tools";
import {LocService} from "../loc.service";


@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  users=[];
  coupons=[];
  shops=[];
  moneys=[];

  constructor(public api:ApiService,public _location:Location,public router:Router,public loc:LocService) {
    if(_location.path().indexOf(ADMIN_PASSWORD)==-1)
      router.navigate(["home"]);
  }

  ngOnInit() {
    this.api.getusers().subscribe((r:any)=>{this.users=r;},(error)=>{showError(this,error);})
    this.api.getcoupons().subscribe((r:any)=>{this.coupons=r;},(error)=>{showError(this,error);})
    this.api.getshops().subscribe((r:any)=>{this.shops=r;},(error)=>{showError(this,error);})
    this.api.getmoneys().subscribe((r:any)=>{this.moneys=r;},(error)=>{showError(this,error);})
  }

  convertDate(dt){
    var rc=new Date();
    rc.setTime(dt*1000);
    return rc;
  }

  raz(){
    var hwnd=window.open("http://localhost:5500/api/raz/hh4271");
    setTimeout(()=>{
      hwnd.location.href="http://localhost:4200";
      setTimeout(()=> {
        window.location.reload();
      },2000);
    },2000)
  }

  openAppli() {

  }

  create_user(nCompte){
    this.loc.getPosition().then((pos:any)=>{
      var xy=prompt("Point de chute",pos.lat+","+pos.lng);
      var n=prompt("Nombre de user","10");
      xy=xy.replace(",","/");
      window.open("https://server.f80.fr:5500/api/fictif/"+xy+"/0/rand/"+n);
    });


  }

  openGraph(shopid,type){
    window.open(openGraphForShop(shopid,type),"_blank");
  }
}

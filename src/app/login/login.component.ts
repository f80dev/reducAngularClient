import { Component, OnInit } from '@angular/core';
import {ErrorStateMatcher} from '@angular/material';
import {FormControl, FormGroupDirective, NgForm, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {ApiService} from '../api.service';

import {
  FacebookLoginProvider,
  GoogleLoginProvider,
  SocialService
} from "ngx-social-button";
//import {LinkedinLoginProvider} from "../../../node_modules/ngx-social-button/lib/providers/linkedinProvider";


/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  shareObj = {
    href: "FACEBOOK-SHARE-LINK",
    hashtag:"#FACEBOOK-SHARE-HASGTAG"
  };

  constructor(public api: ApiService, public router: Router, public route: ActivatedRoute,
              private socialAuthService: SocialService) { }
  email = 'paul.dudule@gmail.com';
  showLogin=false;
  message="";

  ngOnInit() {


    if (localStorage.getItem('user') != null) {
      this.email = localStorage.getItem('user');
      this.login();
    } else
      this.showLogin=true;
  }

  email_login(){
    var firstname=this.email.split("@")[0];
    this.api.adduser(this.email,firstname).subscribe((res:any)=>{
      localStorage.setItem("code",res.code);
      this.message="Un lien est disponible dans votre boite "+this.email+" pour votre première connexion";
    });
  }

  anonymous_login(){
    if(localStorage.getItem("user")==null){localStorage.setItem("user","user"+new Date().getTime()+"@fictif.com");}
    this.login();
  }

  login() {
    this.route.params.subscribe((params)=>{
      var coupon=params["coupon"];
      if(coupon!=null){
        this.api.flash(this.email, coupon).subscribe((result:any) => {
          localStorage.setItem("showCoupon",result.newcoupon);
          this.router.navigate(['home'],{queryParams:{message:result.message}});
        });
      }

      var password=params["pass"];
      if(password!=null){
        if(localStorage.getItem("code")==password){
          localStorage.setItem("user",params["user"]);
          this.router.navigate(['home']);
        }
      }

      this.router.navigate(['home']);
    });
  }

  signOut(){
    if(this.socialAuthService.isSocialLoggedIn()){
      this.socialAuthService.signOut().then(()=>{
        debugger;
      }).catch((err)=>{
        debugger;
      });
    }
  }

  public socialSignIn(socialPlatform : string) {
    let socialPlatformProvider;
    if(socialPlatform == "facebook"){
      socialPlatformProvider = FacebookLoginProvider.PROVIDER_TYPE;
    }else if(socialPlatform == "google"){
      socialPlatformProvider = GoogleLoginProvider.PROVIDER_TYPE;
    }
    // else if(socialPlatform == "linkedin"){
    //   socialPlatformProvider = LinkedinLoginProvider.PROVIDER_TYPE;
    // }

    this.socialAuthService.signIn(socialPlatformProvider).then(
      (socialUser) => {
          this.api.adduser(socialUser.email,socialUser.name).subscribe((res:any)=>{
            localStorage.setItem("user",res._id);
            this.router.navigate(['home'],{queryParams:{message:res.message}});
          })
      });
  }



}

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

  constructor(public api: ApiService, public router: Router, public route: ActivatedRoute,private socialAuthService: SocialService) { }
  email = 'paul.dudule@gmail.com';
  showLogin=false;

  ngOnInit() {
    if(localStorage.getItem("user")==null){
      localStorage.setItem("user","user"+new Date().getTime()+"@fictif.com");
    }

    if (localStorage.getItem('user') != null) {
      this.email = localStorage.getItem('user');
      this.login();
    }
  }

  login() {
    localStorage.setItem('user', this.email);
    this.route.params.subscribe((params)=>{
      if(params["coupon"]!=null){
        this.api.flash(this.email, params["coupon"]).subscribe((result:any) => {
          this.router.navigate(['home'],{queryParams:{message:result.message}});
        });
      }else {
        this.router.navigate(['home']);
      }
    });
  }


  // public socialSignIn(socialPlatform : string) {
  //   let socialPlatformProvider;
  //   if(socialPlatform == "facebook"){
  //     socialPlatformProvider = FacebookLoginProvider.PROVIDER_TYPE;
  //   }else if(socialPlatform == "google"){
  //     socialPlatformProvider = GoogleLoginProvider.PROVIDER_TYPE;
  //   }
  //
  //   this.socialAuthService.signIn(socialPlatformProvider).then(
  //     (socialUser) => {
  //       console.log(socialPlatform+" sign in data : " , socialUser);
  //     });
  // }
}

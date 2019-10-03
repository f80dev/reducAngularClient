import {Component, Inject, OnInit} from '@angular/core';
import {ErrorStateMatcher} from '@angular/material';
import {FormControl, FormGroupDirective, NgForm, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {ApiService} from '../api.service';

import {
  FacebookLoginProvider,
  GoogleLoginProvider,
  SocialService
} from "ngx-social-button";
import {MAT_DIALOG_DATA, MatDialogRef} from "../../../node_modules/@angular/material/dialog";
import {DialogData} from "../prompt/prompt.component";
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

  constructor(public api: ApiService,
              public router: Router,
              public dialogRef: MatDialogRef<LoginComponent>,@Inject(MAT_DIALOG_DATA) public data: any,
              private socialAuthService: SocialService) { }
  email = 'paul.dudule@gmail.com';
  message="";

  ngOnInit() {
  }

  email_login(){
    var firstname=this.email.split("@")[0];
    this.api.adduser(this.email,firstname).subscribe((res:any)=>{
      localStorage.setItem("code",res.code);
      res.message="Un lien est disponible dans votre boite "+this.email+" pour votre première connexion";
      this.dialogRef.close(res);
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
          this.data.user.email=socialUser.email;
          this.data.user.pseudo=socialUser.name;
          this.api.setuser(this.data.user).subscribe((res:any)=>{
            res.user=this.data.user;
            localStorage.setItem("user",res.user.email);
            this.dialogRef.close(res);
          })
      });
  }


}

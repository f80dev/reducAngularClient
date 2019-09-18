import { Component, OnInit } from '@angular/core';
import {ErrorStateMatcher} from '@angular/material';
import {FormControl, FormGroupDirective, NgForm, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {ApiService} from '../api.service';

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

  constructor(public api: ApiService, public router: Router, public route: ActivatedRoute) { }
  email = 'paul.dudule@gmail.com';

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
    if (this.route.snapshot.queryParamMap.has('coupon')) {
      this.api.flash(this.email, this.route.snapshot.queryParamMap.get('coupon')).subscribe(() => {
        setTimeout(() => {
          this.router.navigate(['home']);
        }, 1000);
      });
    } else {
      this.router.navigate(['home']);
    }
  }
}

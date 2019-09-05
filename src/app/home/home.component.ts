import { Component, OnInit } from '@angular/core';
import {ApiService} from '../api.service';
import {ActivatedRoute, Router} from '@angular/router';
import {checkLogin} from '../tools';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(public api: ApiService, public router: Router, public route: ActivatedRoute) { }

  user: any = {};

  ngOnInit() {
    this.refresh();
  }

  refresh() {
    if (checkLogin(this.router, this.route.snapshot.queryParamMap)) {
      this.api.getuser(localStorage.getItem('user')).subscribe((u) => {
        this.user = u;
      });
    }
  }

  addshop() {
    this.router.navigate(['shop']);
  }
}

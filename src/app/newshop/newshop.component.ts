import { Component, OnInit } from '@angular/core';
import {ApiService} from '../api.service';
import {main} from '@angular/compiler-cli/src/main';
import {checkLogin} from '../tools';
import {ActivatedRoute, Router, Routes} from '@angular/router';

@Component({
  selector: 'app-newshop',
  templateUrl: './newshop.component.html',
  styleUrls: ['./newshop.component.css']
})
export class NewshopComponent implements OnInit {
  shopname = 'Chez Bouly';
  address = 'passage du marché, paris 10';
  owner = '';

  constructor(public api: ApiService, public router: Router) {

  }

  ngOnInit() {
    checkLogin(this.router);
  }

  add() {
    const owner = localStorage.getItem('user');
    this.api.addshop(this.shopname, this.address, owner).subscribe((result: any) => {
      this.router.navigate(['home']);
    });
  }

}

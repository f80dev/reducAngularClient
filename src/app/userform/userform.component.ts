import {Component, Input, OnInit} from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-userform',
  templateUrl: './userform.component.html',
  styleUrls: ['./userform.component.css']
})
export class UserformComponent implements OnInit {

  @Input("user") user:any;

  constructor(public router:Router) { }

  ngOnInit() {
  }

  addshop() {
    this.router.navigate(['shop']);
  }

}

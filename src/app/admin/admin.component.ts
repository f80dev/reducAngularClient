import { Component, OnInit } from '@angular/core';
import {ApiService} from "../api.service";

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  users=[];

  constructor(public api:ApiService) { }

  ngOnInit() {
    this.api.getusers().subscribe((r:any)=>{
      this.users=r;
    })
  }

}

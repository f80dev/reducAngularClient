import {Component, Input, OnInit} from '@angular/core';
import {ApiService} from "../api.service";
import {Socket} from "ngx-socket-io";

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.css']
})
export class TransactionsComponent implements OnInit {

  @Input("userid") userid="";
  @Input("shopfilter") shopid="";
  transactions={};

  constructor(public api:ApiService,public socket:Socket) { }

  ngOnInit() {
    this.refresh();
    this.socket.on("refresh",(data:any)=> {
      if (data.user == this.userid) {
        this.refresh();
      }
    });
  }

  refresh(){
    this.api.getTransactions(this.userid,this.shopid).subscribe((lt:any[])=>{
      this.transactions=lt;
    })
  }

}

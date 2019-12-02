import {Component, Input, OnInit} from '@angular/core';
import {ApiService} from "../api.service";

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.css']
})
export class TransactionsComponent implements OnInit {

  @Input("user") user:any={};
  transactions={};

  constructor(public api:ApiService) { }

  ngOnInit() {
    this.refresh();
  }

  refresh(){
    this.api.getTransactions(this.user._id).subscribe((lt:any[])=>{
      this.transactions=lt;
    })
  }

}

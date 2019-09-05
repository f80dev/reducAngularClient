import {Component, Input, OnInit} from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-shops',
  templateUrl: './shops.component.html',
  styleUrls: ['./shops.component.css']
})
export class ShopsComponent implements OnInit {
  // tslint:hkdisable-next-line:no-input-rename
  @Input('shops') shops = [];

  constructor(public router: Router) { }

  ngOnInit() {
  }

  addCoupon(shop: any) {
    this.router.navigate(['new'], { queryParams: { shop: shop.name} });
  }

}

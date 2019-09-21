import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ApiService} from '../api.service';
import {environment} from '../../environments/environment';
import {Router} from '@angular/router';
import {Socket} from "ngx-socket-io";

@Component({
  selector: 'app-list-coupons',
  templateUrl: './list-coupons.component.html',
  styleUrls: ['./list-coupons.component.css']
})
export class ListCouponsComponent implements OnInit {

  // tslint:disable-next-line:no-input-rename
  @Input('coupons') coupons: any[] = [];
  @Output('delete') ondelete: EventEmitter<any>=new EventEmitter();

  constructor(public api: ApiService, public router: Router) { }

  ngOnInit() {
  }

  showCode(coupon: any) {
    coupon.qrcode = environment.domain_appli + '/getqrcode/' + coupon._id;
    if(coupon.showCode==null)coupon.showCode=false;
    coupon.showCode = !coupon.showCode;
  }

  showInfos(coupon: any) {
    if(coupon.showInfos==null)coupon.showInfos=false;
    coupon.showInfos = !coupon.showInfos;
  }

  showAddress(shop: any) {
    window.open('https://www.google.fr/maps/place/' + shop.address);
  }

  remove(coupon: any) {
    this.api.removeCoupon( coupon._id).subscribe(() => {
      //const pos = this.coupons.indexOf(coupon);
      //this.coupons = this.coupons.splice(pos + 1, 1        );
      this.ondelete.emit();
    });
  }

  openPrinter(coupon: any) {
    const printContent:any = document.getElementsByName("print-section")[0];
    const WindowPrt = window.open('', '', 'left=0,top=0,width=900,height=900,toolbar=0,scrollbars=0,status=0');
    WindowPrt.document.write(printContent.innerHTML);
    WindowPrt.document.close();
    WindowPrt.focus();
    WindowPrt.print();
  }
}

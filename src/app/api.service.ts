import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {api} from './tools';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(public http: HttpClient) {}

  public addCoupon(coupon: any) {
    return this.http.post(api('createcoupon'), coupon);
  }

  public addshop(name: string, address: string, owner: string,lng:number,lat:number) {
    return this.http.get(api('addshop/' + name + '/' + address + '/' + owner+"/"+lng+"/"+lat, ''));
  }

  public stopdeal(couponid: string) {
    return this.http.get(api('stopdeal/'+couponid, ''));
  }

  public raz() {
    localStorage.removeItem('user');
    return this.http.get(api('raz', '')).subscribe(() => {});
  }


  getuser(user: string) {
    return this.http.get(api('getuser/' + user, ''));
  }

  flash(user: string, couponid: string) {
    return this.http.get(api('flash/' + couponid + '/' + user, ''));
  }

  removeCoupon( idcoupon: string) {
    return this.http.get(api('removecoupon/'  + idcoupon, ''));
  }

  removeShop(id: any) {
    return this.http.get(api('removeshop/'  + id, ''));
  }

  getcouponinsquare(param: { x0: any; y0: any; x1: any; y1: any }) {
    return this.http.get(api('getcouponinsquare/'  + param.x0+'/'+param.y0+'/'+param.x1+'/'+param.y1, ''));
  }
}

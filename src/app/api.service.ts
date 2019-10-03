import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {api,ADMIN_PASSWORD} from './tools';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(public http: HttpClient) {}

  coupon:any=null;
  user:any=null;
  shop:any=null;

  raz(userid:string) {
    localStorage.removeItem('user');
    return this.http.get(api('raz/'+userid));
  }

  addCoupon(coupon: any) {
    return this.http.post(api('createcoupon'), coupon);
  }

  addshop(name: string, address: string, owner: string,lng:number,lat:number,tags=null) {
    if(tags==null || tags=="")tags="null";
    return this.http.get(api('addshop/' + name + '/' + address + '/' + owner+"/"+lng+"/"+lat+"/"+tags, ''));
  }

  stopdeal(couponid: string) {
    return this.http.get(api('stopdeal/'+couponid, ''));
  }

  getuser(user: string) {
    return this.http.get(api('getuser/' + user));
  }

  setuser(user: any) {
    return this.http.post(api('setuser/' + user["_id"]), user);
  }

  getoldcoupons(shopid: string,ownerid:string) {
    return this.http.get(api('getoldcoupons/' + shopid+"/"+ownerid, ''));
  }

  flash(user: string, couponid: string) {
    return this.http.get(api('flash/' + couponid + '/' + user, ''));
  }

  removeCoupon( idcoupon: string,bDelete=false) {
    return this.http.get(api('removecoupon/'  + idcoupon+"/"+bDelete, ''));
  }

  removeShop(id: any) {
    return this.http.get(api('removeshop/'  + id, ''));
  }

  getcouponinsquare(param: { x0: any; y0: any; x1: any; y1: any }) {
    return this.http.get(api('getcouponinsquare/'  + param.x0+'/'+param.y0+'/'+param.x1+'/'+param.y1, ''));
  }

  follow(userid: string, operation: string, shopid: string) {
    return this.http.get(api('updatefollow/'  + userid+'/'+operation+'/'+shopid, ''));
  }

  delegate(userid: string, shopid: string,operation:string="*") {
    return this.http.get(api('delegate/'  + shopid+'/'+operation+'/'+userid, ''));
  }

  adduser(email: string, firstname: any) {
    return this.http.get(api('adduser/'  + email+'/'+firstname, ''));
  }

  getusers() {
    return this.http.get(api("getusers/"+ADMIN_PASSWORD));
  }
}

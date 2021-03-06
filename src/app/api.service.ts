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

  addshop(shop:any) {
    return this.http.post(api('addshop'),shop);
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

  getoldcoupons(shopid: string) {
    return this.http.get(api('getoldcoupons/' + shopid, ''));
  }

  flash(user: string, couponid: string,gift=false) {
    let s="";
    if(gift)s="?gift";
    return this.http.get(api('flash/' + couponid + '/' + user+s, ''));
  }

  removeCoupon( idcoupon: string,bDelete=false) {
    return this.http.get(api('removecoupon/'  + idcoupon+"/"+bDelete, ''));
  }

  removeShop(id: any) {
    return this.http.get(api('removeshop/'  + id, ''));
  }

  gettokenforimagesearchengine() {
    return this.http.get("https://server.f80.fr:5800/auth?username=reducshare&password=hh");
  }


  getcouponinsquare(param: { x0: any; y0: any; x1: any; y1: any ,user:any}) {
    return this.http.get(api('getcouponinsquare/'  + param.x0+'/'+param.y0+'/'+param.x1+'/'+param.y1, ''));
  }

  follow(userid: string, operation: string, shopid: string) {
    return this.http.get(api('updatefollow/'  + userid+'/'+operation+'/'+shopid, ''));
  }

  delegate(userid: string, shopid: string,operation:string="*") {
    return this.http.get(api('delegate/'  + shopid+'/'+operation+'/'+userid, ''));
  }

  adduser(email: string, firstname:string="",tags="") {
    if(firstname=="")firstname="null"; //sinon l'appel de l'api n'est pas correct
    if(tags=="")tags="null"; //sinon l'appel de l'api n'est pas correct
    var url=api('adduser/'  + email+'/'+firstname+"/"+tags,);
    return this.http.get(url);
  }

  getusers() {
    return this.http.get(api("getusers/"+ADMIN_PASSWORD));
  }

  getcoupons() {
    return this.http.get(api("getcoupons/"+ADMIN_PASSWORD));
  }

  getshops() {
    return this.http.get(api("getshops/"+ADMIN_PASSWORD));
  }

  getmoneys() {
    return this.http.get(api("getmoneys/"+ADMIN_PASSWORD));
  }

  askforemail(email: string,userid:string) {
    return this.http.get(api("askforemail/"+email+"/"+userid));
  }

  updateCoupon(coupon_id: string, field: string, value: string) {
    return this.http.get(api("updatecoupon/"+coupon_id+"/"+field+"/"+value));
  }

  searchImage(query:string,limit:number,token:string){
    var url="https://server.f80.fr:5800/api/"+query+"?limit="+limit+"&quality=true";
    return this.http.get(url,{'headers':{"access_token":token}});
  }

  getUsersFromCoupon(coupon:any,limit=10){
    return this.http.get(api("getusersfromcoupon/"+coupon.origin+"/"+limit));
  }

  checkCode(userid: string, code: string,field:string) {
    return this.http.get(api("checkcode/"+userid+"/"+code+"/"+field));
  }

  drop(coupon: any, lat: number, lng: number, nbr: number) {
    return this.http.get(api("dropcoupon/"+coupon['_id']+"/"+lat+"/"+lng+"/"+nbr));
  }

  getCouponsAround(lng: number, lat: number) {
    return this.http.get(api("getcouponsaround/"+lng+"/"+lat));
  }

  getTransactions(user_id: string,shopid:string="") {
    return this.http.get(api("gettransactions/"+user_id+"/"+shopid));
  }

  tirage(couponid:string,gain: string, limit: string) {
    return this.http.get(api("tirage/"+couponid+"/"+gain+"/"+limit));
  }

  convert(url:string) {
    return this.http.post(api("convert"),url);
  }

  /**
   * Déclenche l'usage de la promotion
   * @param coupon
   */
  use(coupon: any) {
    return this.http.get(api("use/"+coupon._id));
  }

  /**
   * Demande la validation du coupon par le vendeur
   * @param coupon
   */
  ask(coupon: any,update_value=true) {
    return this.http.get(api("ask/"+coupon._id+"/"+update_value));
  }



}

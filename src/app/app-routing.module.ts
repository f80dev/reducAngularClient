import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import {LoginComponent} from './login/login.component';
import {ListCouponsComponent} from './list-coupons/list-coupons.component';
import {NewCouponComponent} from './new-coupon/new-coupon.component';
import {NewshopComponent} from './newshop/newshop.component';
import {HomeComponent} from './home/home.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent},
  { path: 'new', component: NewCouponComponent},
  { path: 'shop', component: NewshopComponent},
  { path: 'coupons', component: ListCouponsComponent},
  { path: 'home', component: HomeComponent}
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forRoot(routes),
    CommonModule
  ],
  exports: [RouterModule]
})

export class AppRoutingModule { }

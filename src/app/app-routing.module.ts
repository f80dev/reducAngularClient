import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import {LoginComponent} from './login/login.component';
import {ListCouponsComponent} from './list-coupons/list-coupons.component';
import {NewshopComponent} from './newshop/newshop.component';
import {HomeComponent} from './home/home.component';
import {NgxPrintModule} from "ngx-print";
import {NgxSocialButtonModule} from "ngx-social-button";
import {NewCouponComponent} from "./new-coupon/new-coupon.component";
import {AdminComponent} from "./admin/admin.component";





const routes: Routes = [
  { path: 'shop', component: NewshopComponent},
  { path: 'coupons', component: ListCouponsComponent},
  { path: 'new_coupon', component: NewCouponComponent},
  { path: 'home/:coupon', component: HomeComponent},
  { path: 'home', component: HomeComponent},
  { path: 'login', component: LoginComponent},
  { path: 'admin', component: AdminComponent},
  { path: '', component: HomeComponent},
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forRoot(routes),
    CommonModule,
    NgxPrintModule,
    NgxSocialButtonModule
  ],
  exports: [RouterModule]
})

export class AppRoutingModule { }

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import {LoginComponent} from './login/login.component';
import {ListCouponsComponent} from './list-coupons/list-coupons.component';
import {NewshopComponent} from './newshop/newshop.component';
import {HomeComponent} from './home/home.component';
import {NgxPrintModule} from "ngx-print";
import {JwSocialButtonsModule} from "jw-angular-social-buttons";

const routes: Routes = [
  { path: 'login', component: LoginComponent},
  { path: 'login/:coupon', component: LoginComponent},
  { path: 'shop', component: NewshopComponent},
  { path: 'coupons', component: ListCouponsComponent},
  { path: 'home', component: HomeComponent},
  { path: '', component: HomeComponent},
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forRoot(routes),
    CommonModule,
    NgxPrintModule,
    JwSocialButtonsModule
  ],
  exports: [RouterModule]
})

export class AppRoutingModule { }

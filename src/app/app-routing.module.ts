import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import {LoginComponent} from './login/login.component';
import {ListCouponsComponent} from './list-coupons/list-coupons.component';
import {NewshopComponent} from './newshop/newshop.component';
import {HomeComponent} from './home/home.component';
import {PrintLayoutComponent} from "./print-layout/print-layout.component";

const routes: Routes = [
  { path: 'login', component: LoginComponent},
  { path: 'shop', component: NewshopComponent},
  { path: 'coupons', component: ListCouponsComponent},
  { path: 'home', component: HomeComponent},
  { path: 'print',component: PrintLayoutComponent}
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

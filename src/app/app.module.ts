import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import {HttpClientModule} from '@angular/common/http';
import {ApiService} from './api.service';
import { LoginComponent } from './login/login.component';
import { NewCouponComponent } from './new-coupon/new-coupon.component';
import { ListCouponsComponent } from './list-coupons/list-coupons.component';
import { AppRoutingModule } from './app-routing.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MAT_DIALOG_DEFAULT_OPTIONS,
  MatButtonModule,
  MatCardModule,
  MatDialogModule,
  MatIconModule,
  MatInputModule,
  MatSnackBarModule
} from '@angular/material';
import { NewshopComponent } from './newshop/newshop.component';
import { HomeComponent } from './home/home.component';
import { ShopsComponent } from './shops/shops.component';
import { UserformComponent } from './userform/userform.component';
import { ClipboardModule } from 'ngx-clipboard';
import { PrintLayoutComponent } from './print-layout/print-layout.component';
import { ShowcodeComponent } from './showcode/showcode.component';
import {SocketIoConfig, SocketIoModule} from "ngx-socket-io";
import {QRCodeModule} from "angular2-qrcode";
import { TimerComponent } from './timer/timer.component';

const config: SocketIoConfig = { url: environment.socket_server, options: {} };

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    NewCouponComponent,
    ListCouponsComponent,
    NewshopComponent,
    HomeComponent,
    ShopsComponent,
    UserformComponent,
    PrintLayoutComponent,
    ShowcodeComponent,
    TimerComponent
  ],
  entryComponents: [
    NewCouponComponent
  ],

  imports: [
    SocketIoModule.forRoot(config),
    MatDialogModule,
    QRCodeModule,
    ClipboardModule,
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ServiceWorkerModule.register('ngsw-worker.js', {enabled: environment.production}),
    AppRoutingModule,
    FormsModule,
    MatIconModule,
    MatCardModule,
    MatButtonModule,
    MatInputModule,
    ReactiveFormsModule,
    MatSnackBarModule
  ],
  providers: [
    ApiService,
    {provide: MAT_DIALOG_DATA, useValue: {hasBackdrop: false}}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

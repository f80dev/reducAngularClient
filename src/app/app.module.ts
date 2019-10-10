import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {
  NgxSocialButtonModule,
  SocialServiceConfig
} from "ngx-social-button";
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import {HttpClientModule} from '@angular/common/http';
import {ApiService} from './api.service';
import { LoginComponent } from './login/login.component';
import { NewCouponComponent } from './new-coupon/new-coupon.component';
import { ListCouponsComponent } from './list-coupons/list-coupons.component';
import {WebcamModule} from 'ngx-webcam';
import { AppRoutingModule } from './app-routing.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MAT_DIALOG_DEFAULT_OPTIONS,
  MatButtonModule,
  MatCardModule, MatCheckboxModule,
  MatDialogModule,
  MatIconModule,
  MatInputModule, MatListModule, MatSelectModule,
  MatSnackBarModule, MatStepperModule, MatToolbarModule
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
import {getAuthServiceConfigs} from "./tools";
import { TutoComponent } from './tuto/tuto.component';
import { FlashscreenComponent } from './flashscreen/flashscreen.component';
import { OldCouponsComponent } from './old-coupons/old-coupons.component';
import { PrintCouponComponent } from './print-coupon/print-coupon.component';
import { PromptComponent } from './prompt/prompt.component';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { InputComponent } from './input/input.component';
import { DeviceDetectorModule } from 'ngx-device-detector';
import { VisualComponent } from './visual/visual.component';
import { ScannerComponent } from './scanner/scanner.component';
import { AdminComponent } from './admin/admin.component';
import { CguComponent } from './cgu/cgu.component';
import { SafePipe } from './safe.pipe';
import { TransPipe } from './trans.pipe';
import { AboutComponent } from './about/about.component';

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
    TimerComponent,
    TutoComponent,
    FlashscreenComponent,
    OldCouponsComponent,
    PrintCouponComponent,
    PromptComponent,
    InputComponent,
    VisualComponent,
    ScannerComponent,
    AdminComponent,
    CguComponent,
    SafePipe,
    TransPipe,
    AboutComponent
  ],
  entryComponents: [
    NewCouponComponent,
    PromptComponent
  ],

  imports: [
    SocketIoModule.forRoot(config),
    MatDialogModule,
    MatToolbarModule,
    MatProgressSpinnerModule,
    QRCodeModule,
    ClipboardModule,
    NgxSocialButtonModule,
    BrowserModule,
    MatSelectModule,
    HttpClientModule,
    WebcamModule,
    MatCheckboxModule,
    MatStepperModule,
    BrowserAnimationsModule,
    ServiceWorkerModule.register('ngsw-worker.js', {enabled: environment.production}),
    AppRoutingModule,
    FormsModule,
    MatIconModule,
    MatCardModule,
    MatButtonModule,
    MatInputModule,
    MatListModule,
    ReactiveFormsModule,
    MatSnackBarModule,
    DeviceDetectorModule.forRoot()
  ],
  providers: [
    ApiService,TransPipe,SafePipe,
    {provide: SocialServiceConfig,useFactory: getAuthServiceConfigs},
    {provide: MAT_DIALOG_DATA, useValue: {hasBackdrop: false}}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

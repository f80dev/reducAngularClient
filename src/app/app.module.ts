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
  MatButtonModule,
  MatCardModule, MatCheckboxModule,
  MatDialogModule, MatExpansionModule, MatGridListModule,
  MatIconModule,
  MatInputModule, MatListModule, MatSelectModule,
  MatSnackBarModule, MatStepperModule, MatToolbarModule
} from '@angular/material';
import { NewshopComponent } from './newshop/newshop.component';
import { HomeComponent } from './home/home.component';
import { ShopsComponent } from './shops/shops.component';
import { UserformComponent } from './userform/userform.component';
import {ClipboardModule, ClipboardService} from 'ngx-clipboard';
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
import { OrderByPipe } from './order-by.pipe';
import { FlipModule } from 'ngx-flip';
import { NewCouponSimpleComponent } from './new-coupon-simple/new-coupon-simple.component';
import { ImageSelectorComponent } from './image-selector/image-selector.component';
import { LiteralPipe } from './literal.pipe';
import { PickerModule } from '@ctrl/ngx-emoji-mart';
import { ChartsComponent } from './charts/charts.component';
import { TransactionsComponent } from './transactions/transactions.component';
import { TruncPipe } from './trunc.pipe';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {ImageCropperModule} from "ngx-image-cropper";
import { TransacshopComponent } from './transacshop/transacshop.component';


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
    AboutComponent,
    OrderByPipe,
    NewCouponSimpleComponent,
    ImageSelectorComponent,
    LiteralPipe,
    ChartsComponent,
    TransactionsComponent,
    TruncPipe,
    TransacshopComponent
  ],
  entryComponents: [
    NewCouponComponent,
    PromptComponent,
    ImageSelectorComponent
  ],

  imports: [
    FontAwesomeModule,
    PickerModule,
    ImageCropperModule,
    SocketIoModule.forRoot(config),
    MatDialogModule,
    FlipModule,
    MatToolbarModule,
    MatProgressSpinnerModule,
    QRCodeModule,
    ClipboardModule,
    NgxSocialButtonModule,
    BrowserModule,
    MatGridListModule,
    MatExpansionModule,
    MatSelectModule,
    HttpClientModule,
    WebcamModule,
    MatCheckboxModule,
    MatStepperModule,
    BrowserAnimationsModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      registrationStrategy: 'registerImmediately'
    }),
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
    ApiService,TransPipe,SafePipe,ClipboardService,
    {provide: SocialServiceConfig,useFactory: getAuthServiceConfigs},
    {provide: MAT_DIALOG_DATA, useValue: {hasBackdrop: false}}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

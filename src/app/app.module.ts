import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ServiceWorkerModule } from '@angular/service-worker';
import { TranslateModule } from '@ngx-translate/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material.module';
import { NgxSpinnerModule } from 'ngx-spinner';
import { environment } from '@env/environment';
import { CoreModule } from '@core';
import { SharedModule } from '@shared';
import { AuthModule, AuthenticationService } from '@app/auth';
import { HomeModule } from './home/home.module';
import { ShellModule } from './shell/shell.module';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { MatInputModule } from '@angular/material/input';
import { DiscountModule } from './discount/discount.module';
import { OrderHistoryModule } from './order_history/order_history.module';
import { OrdersModule } from './orders/orders.module';
import { ProductModule } from './product/product.module';
import { NotificationModule } from './notifications/notifications.module';
import { ProfileModule } from './profile/profile.module';
import { AgmCoreModule } from '@agm/core';
import { CommonService } from '../../src/app/common/common.service';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { HttpInterceptorBaseAuthService } from './auth/token.interceptor';
import { AuthGuardService as AuthGuard } from '../app/auth/authentication.guard';
@NgModule({
  imports: [
    BrowserModule,
    ServiceWorkerModule.register('./ngsw-worker.js', { enabled: environment.production }),
    FormsModule,
    HttpClientModule,
    TranslateModule.forRoot(),
    BrowserAnimationsModule,
    MaterialModule,
    CoreModule,
    SharedModule,
    NgxSpinnerModule,
    ShellModule,
    HomeModule,
    DiscountModule,
    ProductModule,
    NotificationModule,
    OrderHistoryModule,
    ProfileModule,
    OrdersModule,
    AuthModule,
    AppRoutingModule,
    MatDatepickerModule,

    AgmCoreModule.forRoot({
      // apiKey: 'GOOGLE API KEY',
      // libraries: ['places']
    }),
    MatInputModule, // must be imported as the last module as it contains the fallback route
  ],
  declarations: [AppComponent],
  providers: [
    AuthenticationService,
    CommonService,
    AuthGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpInterceptorBaseAuthService,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}

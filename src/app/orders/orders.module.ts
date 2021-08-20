import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MaterialModule } from '@app/material.module';
import { OrdersRoutingModule } from './orders-routing.module';
import { OrdersComponent } from './orders.component';
import { ViewOrdersComponent } from './view-orders/view-orders.component';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { FormsModule } from '@angular/forms';

import { BrowserModule } from '@angular/platform-browser';
@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    NgxMaterialTimepickerModule,
    CommonModule,
    TranslateModule,
    FlexLayoutModule,
    MaterialModule,
    OrdersRoutingModule,
    MatDatepickerModule,
  ],
  declarations: [OrdersComponent, ViewOrdersComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class OrdersModule {}

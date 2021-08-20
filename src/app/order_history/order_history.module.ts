import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '@app/material.module';
import { OrderHistoryRoutingModule } from './order_history-routing.module';
import { OrderHistoryComponent } from './order_history.component';
import { MatSelectModule } from '@angular/material/select';

@NgModule({
  imports: [
    ReactiveFormsModule,
    MatSelectModule,
    FormsModule,
    CommonModule,
    TranslateModule,
    FlexLayoutModule,
    MaterialModule,
    OrderHistoryRoutingModule,
  ],
  declarations: [OrderHistoryComponent],
})
export class OrderHistoryModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from '@app/material.module';
import { ManageCustomerRoutingModule } from './discount-routing.module';
import { DiscountComponent } from './discount.component';

@NgModule({
  imports: [FormsModule, CommonModule, TranslateModule, FlexLayoutModule, MaterialModule, ManageCustomerRoutingModule],
  declarations: [DiscountComponent],
})
export class DiscountModule {}

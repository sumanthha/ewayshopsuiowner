import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatPaginatorModule } from '@angular/material/paginator';
import { FileDragNDropDirective } from '../common/file-drag-n-drop.directive';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from '@app/material.module';
import { ProductRoutingModule } from './product-routing.module';
import { ProductComponent } from './product.component';
import { ReactiveFormsModule } from '@angular/forms';
@NgModule({
  imports: [
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    TranslateModule,
    FlexLayoutModule,
    MaterialModule,
    ProductRoutingModule,
    MatPaginatorModule,
  ],
  declarations: [ProductComponent, FileDragNDropDirective],
})
export class ProductModule {}

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { marker } from '@biesbjerg/ngx-translate-extract-marker';
import { Shell } from '@app/shell/shell.service';
import { OrdersComponent } from './orders.component';
import { ViewOrdersComponent } from '../orders/view-orders/view-orders.component';
import { AuthGuardService } from '@app/auth';
const routes: Routes = [
  Shell.childRoutes([
    { path: '', redirectTo: '/orders', pathMatch: 'full' },
    { path: 'orders', component: OrdersComponent, canActivate: [AuthGuardService], data: { title: marker('orders') } },
    {
      path: 'orders/view-orders/:id',
      component: ViewOrdersComponent,
      canActivate: [AuthGuardService],
      data: { title: marker('view-orders') },
    },
  ]),
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [],
})
export class OrdersRoutingModule {}

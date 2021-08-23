import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { marker } from '@biesbjerg/ngx-translate-extract-marker';
import { Shell } from '@app/shell/shell.service';
import { OrderHistoryComponent } from './order_history.component';
import { AuthGuardService } from '@app/auth';

// const routes: Routes = [
//   // Module is lazy loaded, see app-routing.module.ts
//   { path: 'manage-branch', component: ManageBranchComponent, data: { title: marker('Abouts') } },
// ];

const routes: Routes = [
  Shell.childRoutes([
    { path: '', redirectTo: '/order-history', pathMatch: 'full' },
    {
      path: 'order-history',
      component: OrderHistoryComponent,
      canActivate: [AuthGuardService],
      data: { title: marker('discount') },
    },
  ]),
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [],
})
export class OrderHistoryRoutingModule {}

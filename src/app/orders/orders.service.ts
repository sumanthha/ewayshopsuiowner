import { Injectable } from '@angular/core';
import { HttpClient, HttpHandler, HttpRequest, HttpEvent, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { CredentialsService } from '../auth/credentials.service';

export interface RandomQuoteContext {
  // The quote's category: 'dev', 'explicit'...
  category: string;
}

@Injectable({
  providedIn: 'root',
})
export class OrdersService {
  constructor(private httpClient: HttpClient, public CredentialsService: CredentialsService) {}

  // GetOrder() {
  //   let token = this.CredentialsService.getToken();
  //   const headers = new HttpHeaders().set('Authorization', 'Bearer ' + token);
  //   return this.httpClient.get('store/order', { headers }).pipe(
  //     map((body: any) => {
  //       if (body) {
  //         return body;
  //       } else {
  //         return {};
  //       }
  //     }),
  //     catchError(() => of([]))
  //   );
  // }

  // GetSingleOrder(id: any) {
  //   let token = this.CredentialsService.getToken();
  //   const headers = new HttpHeaders().set('Authorization', 'Bearer ' + token);
  //   return this.httpClient.get('store/order/' + id, { headers }).pipe(
  //     map((body: any) => {
  //       if (body) {
  //         return body;
  //       } else {
  //         return {};
  //       }
  //     }),
  //     catchError(() => of([]))
  //   );
  // }
  // GetOrders_count() {
  //   let token = this.CredentialsService.getToken();
  //   const headers = new HttpHeaders().set('Authorization', 'Bearer ' + token);
  //   return this.httpClient.get('store/order_status_count/', { headers }).pipe(
  //     map((body: any) => {
  //       if (body) {
  //         return body;
  //       } else {
  //         return {};
  //       }
  //     }),
  //     catchError(() => of([]))
  //   );
  // }
  // GetNewOrders_list() {
  //   let token = this.CredentialsService.getToken();
  //   const headers = new HttpHeaders().set('Authorization', 'Bearer ' + token);
  //   return this.httpClient.get('store/order_status_count_based/', { headers }).pipe(
  //     map((body: any) => {
  //       if (body) {
  //         return body;
  //       } else {
  //         return {};
  //       }
  //     }),
  //     catchError(() => of([]))
  //   );
  // }
  // GetOrderInventory_list() {
  //   let token = this.CredentialsService.getToken();
  //   const headers = new HttpHeaders().set('Authorization', 'Bearer ' + token);
  //   return this.httpClient.get('store/inventory_summary/', { headers }).pipe(
  //     map((body: any) => {
  //       if (body) {
  //         return body;
  //       } else {
  //         return {};
  //       }
  //     }),
  //     catchError(() => of([]))
  //   );
  // }

  // orderStatus_Update(id: any, status: any) {
  //   let token = this.CredentialsService.getToken();
  //   const headers = new HttpHeaders().set('Authorization', 'Bearer ' + token);
  //   return this.httpClient.put('store/order_status_update/' + id, status, { headers }).pipe(
  //     map((body: any) => {
  //       if (body) {
  //         return body;
  //       } else {
  //         return {};
  //       }
  //     }),
  //     catchError(() => of([]))
  //   );
  // }
  // time_Update(id: any, status: any) {
  //   let token = this.CredentialsService.getToken();
  //   const headers = new HttpHeaders().set('Authorization', 'Bearer ' + token);
  //   return this.httpClient.put('store/update_timemanagement/' + id, status, { headers }).pipe(
  //     map((body: any) => {
  //       if (body) {
  //         return body;
  //       } else {
  //         return {};
  //       }
  //     }),
  //     catchError(() => of([]))
  //   );
  // }
}

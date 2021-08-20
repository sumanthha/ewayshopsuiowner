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
export class DiscountService {
  constructor(private httpClient: HttpClient, public CredentialsService: CredentialsService) {}

  // GetProduct() {
  //   let token = this.CredentialsService.getToken();
  //   const headers = new HttpHeaders().set('Authorization', 'Bearer ' + token);
  //   //let myItem = this.CredentialsService.getCustomerId();
  //   return this.httpClient.get('store/product', { headers }).pipe(
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

  // GetMyOrders(data: any) {
  //   return this.httpClient.post('/GetUserAllMy_Orders', { data: data }).pipe(
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

  // CancelOrders(data: any) {
  //   return this.httpClient.post('/CancelOrder', { data: data }).pipe(
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
  // discount(code: any, data: any) {
  //   let token = this.CredentialsService.getToken();
  //   const headers = new HttpHeaders().set('Authorization', 'Bearer ' + token);
  //   let id = data;
  //   return this.httpClient.put('store/discount_update/' + code, data, { headers }).pipe(
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

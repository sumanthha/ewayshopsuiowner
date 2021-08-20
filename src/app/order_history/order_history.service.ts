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
export class OrderHistoryService {
  constructor(private httpClient: HttpClient, public CredentialsService: CredentialsService) {}

  // GetOrder() {
  //   let token = this.CredentialsService.getToken();
  //   const headers = new HttpHeaders().set('Authorization', 'Bearer ' + token);
  //   //let myItem = this.CredentialsService.getCustomerId();
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
  // GetOrderHistory(status: any) {
  //   let token = this.CredentialsService.getToken();
  //   const headers = new HttpHeaders().set('Authorization', 'Bearer ' + token);
  //   //let myItem = this.CredentialsService.getCustomerId();
  //   return this.httpClient.get('store/order_status_history?status=' + status, { headers }).pipe(
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

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
export class ProfileService {
  constructor(private httpClient: HttpClient, public CredentialsService: CredentialsService) {}

  // GetProfile() {
  //   let data = this.CredentialsService.getToken();
  //   var header = {
  //     headers: new HttpHeaders().set('Authorization', 'Bearer ' + data),
  //   };
  //   //let myItem = this.CredentialsService.getCustomerId();
  //   return this.httpClient.get('store/profile/', header).pipe(
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
  // GetCustomer() {
  //   let data = this.CredentialsService.getToken();
  //   var header = {
  //     headers: new HttpHeaders().set('Authorization', 'Bearer ' + data),
  //   };
  //   //let myItem = this.CredentialsService.getCustomerId();
  //   return this.httpClient.get('store/customer/', header).pipe(
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

  // UpdateProfile(req: any) {
  //   let data = this.CredentialsService.getToken();
  //   Headers;
  //   const headers = new HttpHeaders().set('Authorization', 'Bearer ' + data);
  //   return this.httpClient.put('store/profile/update', req, { headers }).pipe(
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
  // getOrders() {
  //   let data = this.CredentialsService.getToken();
  //   const headers = new HttpHeaders().set('Authorization', 'Bearer ' + data);
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
}

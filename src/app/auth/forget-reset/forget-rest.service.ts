import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

const routes = {
  //quote: (c: RandomQuoteContext) => `/jokes/random?category=${c.category}`,
};

export interface RandomQuoteContext {
  // The quote's category: 'dev', 'explicit'...
  category: string;
}

@Injectable({
  providedIn: 'root',
})
export class ForgetPasswordService {
  constructor(private httpClient: HttpClient) {}

  forgot_Password(formdata1: any) {
    let formData: FormData = new FormData();
    formData.append('email', formdata1);
    return this.httpClient.post('store/forget_password/', formData).pipe(
      map((body: any) => {
        if (body) {
          return body;
        } else {
          return {};
        }
      }),
      catchError(() => of([]))
    );
  }
  reset_Password(password: any, accesstoken: any) {
    const formdata = new FormData();
    formdata.append('password', password);
    formdata.append('jwt_token', accesstoken);
    return this.httpClient.post('reset_password/', formdata).pipe(
      map((body: any) => {
        if (body) {
          return body;
        } else {
          return {};
        }
      }),
      catchError(() => of([]))
    );
  }
}

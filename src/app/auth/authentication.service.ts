import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment as ENV } from '../../environments/environment';
import { Router } from '@angular/router';
import { map, catchError } from 'rxjs/operators';

/**
 * Provides a base for authentication workflow.
 * The login/logout methods should be replaced with proper implementation.
 */
@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  constructor(private http: HttpClient, public router: Router) {}
  api_url = `${ENV.serverUrl}`;
  public getToken(): any {
    return localStorage.getItem('access');
  }
  public refreshToken(): any {
    localStorage.getItem('refresh');
  }
  public isAuthenticated(): boolean {
    if (this.getToken()) {
      return true;
    } else {
      return false;
    }
  }
  logout() {
    localStorage.clear();
    sessionStorage.clear();
    this.router.navigateByUrl('/login');
  }
  login(payload: any) {
    let url = this.api_url + 'login/';
    return this.http.post<Response[]>(`${url}`, payload);
  }
  GetNewOrders_list() {
    let url = this.api_url + 'store/order_status_count_based/';
    return this.http.get<Response[]>(`${url}`);
  }
  GetOrders_count() {
    let url = this.api_url + 'store/order_status_count/';
    return this.http.get<Response[]>(`${url}`);
  }
  GetOrderInventory_list() {
    let url = this.api_url + 'store/inventory_summary/';
    return this.http.get<Response[]>(`${url}`);
  }
  GetProduct() {
    let url = this.api_url + 'store/product';
    return this.http.get<Response[]>(`${url}`);
  }
  GetMyOrders(reset_req: any) {
    let url = this.api_url + 'GetUserAllMy_Orders';
    return this.http.post<Response[]>(`${url}`, reset_req);
  }
  CancelOrders(data: any) {
    let url = this.api_url + 'CancelOrder';
    return this.http.post<Response[]>(`${url}`, data);
  }

  discount(code: any, data: any) {
    let url = this.api_url + 'store/discount_update/' + code;
    return this.http.put<Response[]>(`${url}`, data);
  }
  GetNotification() {
    let url = this.api_url + 'store/notification_get/';
    return this.http.get<Response[]>(`${url}`);
  }

  DeleteNotification(data: any) {
    let token = this.getToken();
    const options = {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + token,
      }),
      body: {
        delete_id: data,
      },
    };
    return this.http.delete('store/notification_delete/', options).pipe(
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

  GetNotificationCount() {
    let url = this.api_url + 'store/notification_count/';
    return this.http.get<Response[]>(`${url}`);
  }
  GetOrder() {
    let url = this.api_url + 'store/order';
    return this.http.get<Response[]>(`${url}`);
  }

  GetSingleOrder(id: any) {
    let url = this.api_url + 'store/order/';
    return this.http.post<Response[]>(`${url}`, id);
  }

  orderStatus_Update(status: any) {
    let url = this.api_url + 'store/order_status_update';
    return this.http.put<Response[]>(`${url}`, status);
  }
  time_Update(status: any) {
    let url = this.api_url + 'store/update_timemanagement/';
    return this.http.put<Response[]>(`${url}`, status);
  }

  GetOrderHistory(status: any) {
    let url = this.api_url + 'store/order_status_history?status=' + status;
    return this.http.get<Response[]>(`${url}`);
  }
  create_product(data: any) {
    let url = this.api_url + 'store/product';
    return this.http.post<Response[]>(`${url}`, data);
  }
  getProduct() {
    let url = this.api_url + 'store/product';
    return this.http.get<Response[]>(`${url}`);
  }
  getSingleProduct(id: any) {
    let url = this.api_url + 'store/product/' + id;
    return this.http.get<Response[]>(`${url}`);
  }
  update_product(id: any, data: any) {
    let url = this.api_url + 'store/product/' + id;
    return this.http.put<Response[]>(`${url}`, data);
  }
  deleteSingleProduct(id: any) {
    let url = this.api_url + 'store/product/' + id;
    return this.http.delete<Response[]>(`${url}`);
  }
  product_Bulkupload(event: any) {
    // let token = this.getToken();
    // let httpOptions2 = {
    //   headers: new HttpHeaders({
    //     "Authorization": "Bearer " + token,
    //     'enctype': 'multipart/form-data; boundary=----WebKitFormBoundaryuL67FWkv1CA',
    //   })
    // }
    const formData = new FormData();
    formData.append('csv', event);
    let url = this.api_url + 'store/bulk_upload/product';
    return this.http.post<Response[]>(`${url}`, formData);
  }
  fileDownload(): Observable<any> {
    let url = this.api_url + 'media/sample/inventory.csv';
    return this.http.get(url, { responseType: 'blob' });
  }
  getCategory() {
    let url = this.api_url + 'store/category/';
    return this.http.get(url).pipe(
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
  getSubCategory(value: any) {
    let url = this.api_url + 'store/subcategory/';
    return this.http.get(url + value).pipe(
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
  GetProfile() {
    let url = this.api_url + 'store/profile/';
    //let myItem = this.CredentialsService.getCustomerId();
    return this.http.get(url).pipe(
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
  GetCustomer() {
    let url = this.api_url + 'store/customer/';
    return this.http.get(url).pipe(
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

  UpdateProfile(req: any) {
    let url = this.api_url + 'store/profile/update';
    return this.http.put(url, req).pipe(
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
  getOrders() {
    let url = this.api_url + 'store/order';
    return this.http.get(url).pipe(
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

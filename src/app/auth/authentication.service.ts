import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { environment as ENV } from '../../environments/environment';
import { Credentials, CredentialsService } from './credentials.service';
import { Router } from '@angular/router';
export interface LoginContext {
  access: string;
  refresh: string;
  role: string;
  // token: string;
  // lname: string;
  remember?: boolean;
  // id: string;
}

/**
 * Provides a base for authentication workflow.
 * The login/logout methods should be replaced with proper implementation.
 */
@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  constructor(private credentialsService: CredentialsService, private httpClient: HttpClient, private router: Router) {}
  api_url = `${ENV.serverUrl}`;
  /**
   * Authenticates the user.
   * @param context The login parameters.
   * @return The user credentials.
   */
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
  login(context: LoginContext): Observable<Credentials> {
    // Replace by proper authentication call
    const data = {
      access: context.access,
      refresh: context.refresh,
      role: context.role,
      // token: context.token,
      // lname: context.lname,
      // id: context.id,
    };
    this.credentialsService.setCredentials(data);
    return of(data);
  }

  /**
   * Logs out the user and clear credentials.
   * @return True if the user was logged out successfully.
   */
  logout() {
    localStorage.clear();
    this.router.navigateByUrl('/login');
  }

  forgot_Password(formdata1: any) {
    let formData: FormData = new FormData();
    formData.append('email', formdata1);
    let url = this.api_url + 'store/forget_password/';
    return this.httpClient.post<Response[]>(`${url}`, formData);
  }
  reset_Password(password: any, accesstoken: any) {
    const formdata = new FormData();
    formdata.append('password', password);
    formdata.append('jwt_token', accesstoken);
    let url = this.api_url + 'reset_password/';
    return this.httpClient.post<Response[]>(`${url}`, formdata);
  }
  GetProduct() {
    let url = this.api_url + 'store/product';
    return this.httpClient.get<Response[]>(`${url}`);
  }
  GetMyOrders(data: any) {
    let url = this.api_url + '/GetUserAllMy_Orders';
    return this.httpClient.post<Response[]>(`${url}`, data);
  }
  CancelOrders(data: any) {
    let url = this.api_url + '/CancelOrder';
    return this.httpClient.post<Response[]>(`${url}`, data);
  }
  discount(code: any, data: any) {
    let url = this.api_url + 'store/discount_update/' + code;
    return this.httpClient.put<Response[]>(`${url}`, data);
  }

  GetNotification() {
    let url = this.api_url + 'store/notification_get/';
    return this.httpClient.get<Response[]>(`${url}`);
  }
  DeleteNotification(data: any) {
    let url = this.api_url + 'store/notification_delete/';
    return this.httpClient.request('delete', url, { body: data });
  }
  GetNotificationCount() {
    let url = this.api_url + 'store/notification_count/';
    return this.httpClient.get<Response[]>(`${url}`);
  }
  GetOrder() {
    let url = this.api_url + 'store/order';
    return this.httpClient.get<Response[]>(`${url}`);
  }
  GetOrderHistory(status: any) {
    let url = this.api_url + 'store/order_status_history?status=' + status;
    return this.httpClient.get<Response[]>(`${url}`);
  }
  GetSingleOrder(id: any) {
    let url = this.api_url + 'store/order/' + id;
    return this.httpClient.get<Response[]>(`${url}`);
  }
  GetOrders_count() {
    let url = this.api_url + 'store/order_status_count/';
    return this.httpClient.get<Response[]>(`${url}`);
  }
  GetNewOrders_list() {
    let url = this.api_url + 'store/order_status_count_based/';
    return this.httpClient.get<Response[]>(`${url}`);
  }
  GetOrderInventory_list() {
    let url = this.api_url + 'store/inventory_summary/';
    return this.httpClient.get<Response[]>(`${url}`);
  }
  orderStatus_Update(id: any, status: any) {
    let url = this.api_url + 'store/order_status_update/' + id;
    return this.httpClient.put<Response[]>(`${url}`, status);
  }
  time_Update(id: any, status: any) {
    let url = this.api_url + 'store/update_timemanagement/' + id;
    return this.httpClient.put<Response[]>(`${url}`, status);
  }
  create_product(data: any) {
    let url = this.api_url + 'store/product';
    return this.httpClient.post<Response[]>(`${url}`, data);
  }
  getProduct() {
    let url = this.api_url + 'store/product';
    return this.httpClient.get<Response[]>(`${url}`);
  }
  getSingleProduct(id: any) {
    let url = this.api_url + 'store/product/' + id;
    return this.httpClient.get<Response[]>(`${url}`);
  }
  update_product(id: any, data: any) {
    let url = this.api_url + 'store/product/' + id;
    return this.httpClient.put<Response[]>(`${url}`, data);
  }
  deleteSingleProduct(id: any) {
    let url = this.api_url + 'store/product/' + id;
    return this.httpClient.request('delete', url);
  }
  product_Bulkupload(event: any) {
    const formData = new FormData();
    formData.append('csv', event);
    let url = this.api_url + 'store/bulk_upload/product';
    return this.httpClient.post<Response[]>(`${url}`, formData);
  }
  getCategory() {
    let url = this.api_url + 'store/category/';
    return this.httpClient.get<Response[]>(`${url}`);
  }
  getSubCategory(value: any) {
    let url = this.api_url + 'store/subcategory/' + value;
    return this.httpClient.get<Response[]>(`${url}`);
  }
  GetProfile() {
    let url = this.api_url + 'store/profile/';
    return this.httpClient.get<Response[]>(`${url}`);
  }
  GetCustomer() {
    let url = this.api_url + 'store/customer/';
    return this.httpClient.get<Response[]>(`${url}`);
  }
  UpdateProfile(req: any) {
    let url = this.api_url + 'store/profile/update';
    return this.httpClient.put<Response[]>(`${url}`, req);
  }
  getOrders() {
    let url = this.api_url + 'store/order';
    return this.httpClient.get<Response[]>(`${url}`);
  }
}

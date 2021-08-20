import { Component, OnInit, ViewChild } from '@angular/core';

import { environment } from '@env/environment';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { OrdersService } from '../../orders/orders.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthenticationService } from '../../auth/authentication.service';
export interface ManageOrderData {
  id: number;
  first_name: string;
  last_name: string;
  phone_number: number;
  address: string;
}
let ORDER_DATA: ManageOrderData[] = [];
let CUSTOMER_DATA: ManageOrderData[] = [];

@Component({
  selector: 'app-managebranch',
  templateUrl: './view-orders.component.html',
  styleUrls: ['./view-orders.component.scss'],
})
export class ViewOrdersComponent implements OnInit {
  displayedColumns = [
    'id',
    'order_no',
    'order_date',
    'item_name',
    'item_desc',
    'quantity',
    'Order_reason',
    'Item_image',
    'amount',
    'order_status',
  ];
  displayedColumns_cust = ['id', 'First_name', 'email_id', 'phone_no', 'Location'];
  dataSource = new MatTableDataSource<ManageOrderData>(ORDER_DATA);
  CustTable: MatTableDataSource<any>;
  GetOrder: any = [];
  GetCustomer: any = [];
  id: any;
  display: any = 'none';
  OrderTable: any;
  CustomerTable: any;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private OrdersService: OrdersService,
    private router: Router,
    private route: ActivatedRoute,
    private Spinner: NgxSpinnerService,
    private authenticationService: AuthenticationService
  ) {}

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
    this.Spinner.show();
    this.authenticationService.GetSingleOrder(this.id).subscribe((response) => {
      this.Spinner.hide();
      this.GetOrder = [];
      if (response['status'] == 'ok') {
        if (response['data'].order_status == 'rejected') {
          this.displayedColumns = [
            'id',
            'order_no',
            'order_date',
            'item_name',
            'quantity',
            'Order_reason',
            'Item_image',
            'unit_price',
            'total_amount',
            'order_status',
          ];
        } else {
          this.displayedColumns = [
            'id',
            'order_no',
            'order_date',
            'item_name',
            'quantity',
            'Item_image',
            'unit_price',
            'total_amount',
            'order_status',
          ];
        }
        response['data']['orderlist'].forEach((order: any, index: any) => {
          let obj = {
            sno: index + 1,
            order_id: response['data'].order_id,
            item_name: order['item'].item_name,
            item_description: order['item'].item_description,
            item_image: order['item'].item_image,
            unit_price: order['price'],
            total_amount: order['total_price'],
            order_date: response['data'].order_date,
            order_status: response['data'].order_status,
            reson: response['data'].reason,
            quantity: order['quantity'],
          };
          this.GetOrder.push(obj);
        });
        response['data']['customerlist'].forEach((customer: any, index: any) => {
          let obj = {
            sno: index + 1,
            first_name: customer.first_name,
            email: customer.email,
            phone_no: customer.phone_number,
            gender: customer.gender,
            address: customer.address,
          };
          this.GetCustomer.push(obj);
        });
      }
      ORDER_DATA = this.GetOrder;
      this.OrderTable = new MatTableDataSource(this.GetOrder);
      setTimeout(() => (this.OrderTable.paginator = this.paginator));
      setTimeout(() => (this.OrderTable.sort = this.sort));

      CUSTOMER_DATA = this.GetCustomer;
      this.CustomerTable = new MatTableDataSource(this.GetCustomer);
      setTimeout(() => (this.CustomerTable.paginator = this.paginator));
      setTimeout(() => (this.CustomerTable.sort = this.sort));
    });
  }
  searchUser(filterValue: string) {
    this.OrderTable.filter = filterValue.trim().toLowerCase();
    if (this.OrderTable.paginator) {
      this.OrderTable.paginator.firstPage();
    }
  }
  modalOpen() {
    this.display = 'block';
  }
  modalClose() {
    this.display = 'none';
  }
  back() {
    this.router.navigate(['/orders']);
  }
}

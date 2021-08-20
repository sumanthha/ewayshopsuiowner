import { Component, OnInit, ViewChild } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { CommonService } from '../common/common.service';
import { QuoteService } from './quote.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { OrdersService } from '../orders/orders.service';
import { MatTableDataSource } from '@angular/material/table';
import { NotificationService } from '../notifications/notifications.service';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { AuthenticationService } from '../auth/authentication.service';
export interface PeriodicElement {
  orderid: any;
  date: any;
  customername: any;
  mail: string;
  amount: any;
  status: string;
}
const ELEMENT_DATA: PeriodicElement[] = [
  {
    orderid: 1,
    customername: 'Hydrogen',
    date: '16-01-2021',
    mail: 'test@gmail.com',
    amount: 200,
    status: 'New Order',
  },
  {
    orderid: 1,
    customername: 'Hydrogen',
    date: '16-01-2021',
    mail: 'test@gmail.com',
    amount: 200,
    status: 'New Order',
  },
  {
    orderid: 1,
    customername: 'Hydrogen',
    date: '16-01-2021',
    mail: 'test@gmail.com',
    amount: 200,
    status: 'New Order',
  },
  {
    orderid: 1,
    customername: 'Hydrogen',
    date: '16-01-2021',
    mail: 'test@gmail.com',
    amount: 200,
    status: 'New Order',
  },
];

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  displayedColumns: string[] = ['order_id', 'order_date', 'customer', 'email', 'amount', 'order_status'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  dataSource = ELEMENT_DATA;
  quote: string | undefined;
  isLoading = false;
  profilePic: any;
  profileName: any;
  Neworder_count: any;
  Completedorder_count: any;
  Inprocessingorder_count: any;
  new_list: any = [];
  OrdersTable: MatTableDataSource<unknown>;
  notifyBadge: any;
  inventory_list: any = [];

  constructor(
    private quoteService: QuoteService,
    private CommonService: CommonService,
    private OrdersService: OrdersService,
    private Spinner: NgxSpinnerService,
    private NotificationService: NotificationService,
    private authenticationService: AuthenticationService
  ) {}

  ngOnInit() {
    this.CommonService.Notify_count.subscribe((count) => (this.notifyBadge = count));

    this.profilePic = localStorage.getItem('profilePic');
    this.CommonService.profilePic.subscribe((res) => {
      this.profilePic = res;
    });
    this.CommonService.name.subscribe((res) => {
      this.profileName = res;
    });
    this.isLoading = true;
    this.quoteService
      .getRandomQuote({ category: 'dev' })
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe((quote: string) => {
        this.quote = quote;
      });
    this.Spinner.show();
    this.authenticationService.GetOrders_count().subscribe((response) => {
      this.Spinner.hide();
      if (response['status'] == 'OK') {
        this.Neworder_count = response['new'];
        this.Completedorder_count = response['completed'];
        this.Inprocessingorder_count = response['processing'];
      }
    });

    this.Spinner.show();
    this.authenticationService.GetNotificationCount().subscribe((response) => {
      this.Spinner.hide();
      if (response['status'] == 'ok') {
        this.CommonService.notification_count(response['data']);
      }
    });

    this.Spinner.show();
    this.authenticationService.GetOrderInventory_list().subscribe((response) => {
      this.Spinner.hide();
      if (response['status'] == 'ok') {
        response['data'].forEach((orders: any, index: any) => {
          let obj = {
            sno: index + 1,
            item_name: orders['item']['item_name'],
            item_code: orders['item_code'],
            item_image: orders['item']['item_image'],
          };
          this.inventory_list.push(obj);
        });
      }
    });

    this.Spinner.show();
    this.authenticationService.GetNewOrders_list().subscribe((response) => {
      this.Spinner.hide();
      if (response['status'] == 'OK') {
        this.new_list = [];
        //this.new_list=response['new'];
        response['new'].forEach((orders: any, index: any) => {
          let obj = {
            sno: index + 1,
            order_id: orders['order_id'],
            order_date: orders['order_date'],
            customer: orders['customerlist'][0]['first_name'],
            email: orders['customerlist'][0]['email'],
            amount: orders['amount'],
            order_status: orders['order_status'],
          };
          this.new_list.push(obj);
        });
      }
      this.OrdersTable = new MatTableDataSource(this.new_list);
      setTimeout(() => (this.OrdersTable.paginator = this.paginator));
      setTimeout(() => (this.OrdersTable.sort = this.sort));
    });
  }
}

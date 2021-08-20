import { Component, OnInit, ViewChild } from '@angular/core';

import { environment } from '@env/environment';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { OrdersService } from './orders.service';
import { FormControl, FormGroup } from '@angular/forms';
import Swal from 'sweetalert2';
import { NgxSpinnerService } from 'ngx-spinner';
import { ReturnStatement } from '@angular/compiler';
import { AuthenticationService } from '../auth/authentication.service';
export interface ManageCustomerData {
  id: number;
  first_name: string;
  last_name: string;
  phone_number: number;
  address: string;
}
let CUSTOMER_DATA: ManageCustomerData[] = [];

@Component({
  selector: 'app-managebranch',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss'],
})
export class OrdersComponent implements OnInit {
  displayedColumns = [
    'id',
    'order_no',
    'ordered_on',
    'customer_no',
    'amount',
    'prefer_pickup_time',
    'est_pickup_time',
    'order_status',
    'action',
  ];
  dataSource = new MatTableDataSource<ManageCustomerData>(CUSTOMER_DATA);
  CustTable: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  GetBranch: any = [];
  display: any = 'none';
  display2: any = 'none';
  start_time: any;
  BranchTable: any;
  end_time: any;
  order_id: any;
  Est_date: any;

  validEsttime: boolean = true;
  valid_starttime: boolean = true;
  valid_endtime: boolean = true;
  customer_name: any;
  TimeCalander: boolean = false;
  minDate = new Date();
  constructor(
    private OrdersService: OrdersService,
    private Spinner: NgxSpinnerService,
    private authenticationService: AuthenticationService
  ) {}

  ngOnInit() {
    this.Spinner.show();
    this.authenticationService.GetOrder().subscribe((response) => {
      this.GetBranch = [];
      this.Spinner.hide();
      if (response['status'] == 'ok') {
        response['data'].forEach((orders: any, index: any) => {
          if (orders['order_status'] == 'ready for pickup') {
            this.TimeCalander = true;
          } else {
            this.TimeCalander = false;
          }
          let obj = {
            sno: index + 1,
            order_id: orders['order_id'],
            order_date: orders['order_date'],
            customer: orders['customerlist'][0]['first_name'],
            Amount: orders['amount'],
            order_status: orders['order_status'],
            prefer_from_date: orders['customer_from_date'],
            prefer_start_time: orders['customer_start_time'],
            prefer_end_time: orders['customer_end_time'],
            est_pickup_time: orders['est_from_date'],
            est_starttime: orders['est_start_time'],
            est_endtime: orders['est_end_time'],
            is_showcalander: this.TimeCalander,
          };
          this.GetBranch.push(obj);
        });
      }
      CUSTOMER_DATA = this.GetBranch;
      this.BranchTable = new MatTableDataSource(this.GetBranch);
      setTimeout(() => (this.BranchTable.paginator = this.paginator));
      setTimeout(() => (this.BranchTable.sort = this.sort));
    });
  }
  searchUser(filterValue: string) {
    this.BranchTable.filter = filterValue.trim().toLowerCase();
    if (this.BranchTable.paginator) {
      this.BranchTable.paginator.firstPage();
    }
  }

  modalOpen(order_id: any) {
    this.order_id = order_id;
    this.display = 'block';
  }
  async order_status(Order_id: any, status: any) {
    if (status == 'rejected') {
      const { value: text } = await Swal.fire({
        input: 'textarea',
        inputLabel: 'Are you sure want to rejected ?',
        inputPlaceholder: 'Type your message here...',
        inputAttributes: {
          'aria-label': 'Type your message here',
        },
        showCancelButton: false,
      });

      if (!text) {
        Swal.fire('failure', ' Please enter notes', 'error');
        return;
      } else {
        let status_req = {
          order_status: status,
          reason: text,
        };
        this.Spinner.show();
        this.authenticationService.orderStatus_Update(Order_id, status_req).subscribe((response) => {
          this.Spinner.hide();
          if (response['status'] == 'ok') {
            Swal.fire('Success', ' Order Status Updated Successfully', 'success');
            this.display = 'none';
            this.ngOnInit();
          } else {
            Swal.fire('Failure', response['data'], 'error');
          }
        });
      }
    } else {
      Swal.fire({
        title: 'Are You Sure to Changed Status?',
        showCancelButton: true,
        confirmButtonText: 'Yes!',
        cancelButtonText: 'No',
      }).then((result) => {
        if (result.value) {
          let status_req = {
            order_status: status,
            reason: '',
          };
          this.Spinner.show();
          this.authenticationService.orderStatus_Update(Order_id, status_req).subscribe((response) => {
            this.Spinner.hide();
            if (response['status'] == 'ok') {
              if (status == 'ready for pickup') {
                Swal.fire('Success', 'Could you please add Estimated pickup Time to this order', 'success');
                this.display = 'none';
                this.ngOnInit();
                return;
              } else {
                Swal.fire('Success', ' Order Status Updated Successfully', 'success');
                this.display = 'none';
                this.ngOnInit();
                return;
              }
            } else {
              Swal.fire('Failure', response['data'], 'error');
            }
          });
        }
      });
    }
  }
  modalOpen_Cal(order_id: any, customer: any, order_status: any) {
    if (order_status == 'ready for pickup') {
      this.order_id = order_id;
      this.customer_name = customer;
      this.display2 = 'block';
    } else {
      this.display2 = 'none';
    }
  }
  modalClose() {
    this.display = 'none';
    this.display2 = 'none';
    this.validEsttime = true;
    this.valid_endtime = true;
    this.valid_starttime = true;
    this.Est_date = null;
    this.start_time = '';
    this.end_time = '';
  }
  onChangeHour(event: any) {}
  EndDateChange(event: any) {
    this.Est_date = event.target.value;
  }
  update_Est_Time() {
    if (this.Est_date == '' || this.Est_date == undefined) {
      this.validEsttime = false;
      return false;
    } else {
      this.validEsttime = true;
    }
    if (this.start_time == undefined) {
      this.valid_starttime = false;
      return false;
    } else {
      this.valid_starttime = true;
    }
    if (this.end_time == undefined) {
      this.valid_endtime = false;
      return false;
    } else {
      this.valid_endtime = true;
    }
    let data = {
      est_from_date: this.Est_date,
      est_start_time: this.start_time,
      est_end_time: this.end_time,
    };
    this.Spinner.show();
    this.authenticationService.time_Update(this.order_id, data).subscribe((response) => {
      this.Spinner.hide();
      this.GetBranch = [];
      if (response['status'] == 'ok') {
        Swal.fire('Success', 'Est Pickup time Updated Successfully', 'success');
        this.display2 = 'none';
        this.Est_date = '';
        this.start_time = '';
        this.end_time = '';
        this.ngOnInit();
      } else {
        Swal.fire('Failure', response['data'], 'error');
      }
    });
  }
}

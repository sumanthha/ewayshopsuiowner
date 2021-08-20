import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgxSpinnerService } from 'ngx-spinner';
import { environment } from '@env/environment';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { OrderHistoryService } from './order_history.service';
import { AuthenticationService } from '../auth/authentication.service';
import * as fs from 'file-saver';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';
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
  templateUrl: './order_history.component.html',
  styleUrls: ['./order_history.component.scss'],
})
export class OrderHistoryComponent implements OnInit {
  displayedColumns = ['id', 'order_no', 'order_date', 'customer', 'phone_no', 'email_id', 'address', 'order_status'];
  dataSource = new MatTableDataSource<ManageCustomerData>(CUSTOMER_DATA);
  CustTable: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  GetBranch: any = [];
  display: any = 'none';
  BranchTable: any;
  code: any;
  price: any;
  name: any;
  discount: any;
  showupdate: boolean = false;

  selectedBranch: any = 'all';

  Orderhistory_list = [
    {
      id: 'all',
      name: 'All',
    },
    {
      id: 'new',
      name: 'New',
    },
    {
      id: 'rejected',
      name: 'Rejected',
    },
    {
      id: 'pending',
      name: 'Pending',
    },
    {
      id: 'accepted',
      name: 'Accepted',
    },
    {
      id: 'processing',
      name: 'Processing',
    },
    {
      id: 'ready for pickup',
      name: 'Ready for Pickup',
    },
    {
      id: 'completed',
      name: 'Completed',
    },
    {
      id: 'incomplete',
      name: 'Incomplete',
    },
    {
      id: 'refund issued',
      name: 'Refund Issued',
    },
  ];
  selected: string;
  constructor(
    private OrderHistoryService: OrderHistoryService,
    private snackBar: MatSnackBar,
    private Spinner: NgxSpinnerService,
    private authenticationService: AuthenticationService
  ) {}

  ngOnInit() {
    this.selectedBranch = 'all';
    this.Spinner.show();
    this.authenticationService.GetOrder().subscribe((response) => {
      this.Spinner.hide();
      this.GetBranch = [];
      if (response['status'] == 'ok') {
        response['data'].forEach((order: any, index: any) => {
          let obj = {
            sno: index + 1,
            order_no: order.order_id,
            order_date: order.order_date,
            customer: order['customerlist'][0]['first_name'],
            phone_no: order['customerlist'][0]['phone_number'],
            email_id: order['customerlist'][0]['email'],
            address: order['customerlist'][0]['address'],
            order_status: order.order_status,
          };
          this.GetBranch.push(obj);
        });
      }
      CUSTOMER_DATA = this.GetBranch;
      this.BranchTable = new MatTableDataSource(this.GetBranch);
      setTimeout(() => (this.BranchTable.paginator = this.paginator));
      setTimeout(() => (this.BranchTable.sort = this.sort));
    });

    // this.BranchTable = new MatTableDataSource(CUSTOMER_DATA);
    // setTimeout(() => this.BranchTable.paginator = this.paginator);
    // setTimeout(() => this.BranchTable.sort = this.sort);
  }
  searchUser(filterValue: string) {
    this.BranchTable.filter = filterValue.trim().toLowerCase();
    if (this.BranchTable.paginator) {
      this.BranchTable.paginator.firstPage();
    }
  }
  onStatusChange(res: any) {
    let status = res.value;
    this.Spinner.show();
    this.authenticationService.GetOrderHistory(status).subscribe((response) => {
      this.Spinner.hide();
      if (response['status'] == 'OK') {
        this.GetBranch = [];
        response['data'].forEach((order: any, index: any) => {
          let obj = {
            sno: index + 1,
            order_no: order.order_id,
            order_date: order.order_date,
            customer: order['customerlist'][0]['first_name'],
            phone_no: order['customerlist'][0]['phone_number'],
            email_id: order['customerlist'][0]['email'],
            address: order['customerlist'][0]['address'],
            order_status: order.order_status,
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

  public generateExcel(): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.GetBranch);
    console.log('worksheet', worksheet);
    const workbook: XLSX.WorkBook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    //const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });
    this.saveAsExcelFile(excelBuffer, 'Order_history');
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE,
    });
    FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
  }
}

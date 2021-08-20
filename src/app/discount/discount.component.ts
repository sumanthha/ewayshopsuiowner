import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgxSpinnerService } from 'ngx-spinner';
import { environment } from '@env/environment';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { DiscountService } from './discount.service';
import {AuthenticationService} from '../auth/authentication.service';
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
  templateUrl: './discount.component.html',
  styleUrls: ['./discount.component.scss'],
})
export class DiscountComponent implements OnInit {
  displayedColumns = ['id', 'product_id', 'product_name', 'price', 'sku', 'stock', 'product_catey', 'discount'];
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
  constructor(
    private DiscountService: DiscountService,
    private snackBar: MatSnackBar,
    private Spinner: NgxSpinnerService,
    private authenticationService:AuthenticationService
  ) {}

  ngOnInit() {
    this.Spinner.show();
    this.authenticationService.GetProduct().subscribe((response) => {
      this.Spinner.hide();
      this.GetBranch = [];
      if (response['status'] == 'ok') {
        response['data'].forEach((item: any, index: any) => {
          let obj = {
            sno: index + 1,
            item_code: item.item_code,
            item_name: item['item'].item_name,
            category: item['item']['category'].category_name,
            price: item['item_price'],
            sku: item['item_sku'],
            stock: item['item_count'],
            discount: item['item_selling_price'],
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
  modalOpen(name: any, code: any, price: any, discount: any) {
    if (discount > '0') {
      this.showupdate = true;
    } else {
      this.showupdate = false;
    }
    this.name = name;
    this.code = code;
    this.price = price;
    this.discount = discount;
    this.display = 'block';
  }
  modalClose() {
    this.display = 'none';
  }
  saveDiscount(code: any, price: any) {
    let data = {
      item_code: code,
      item_price: price,
      item_discount_percent: this.discount,
    };
    this.Spinner.show();
    this.authenticationService.discount(code, data).subscribe((data) => {
      this.Spinner.hide();

      if (data['status'] == 'ok') {
        this.display = 'none';
        this.snackBar.open('Discount Updated Successfully', 'Close', {
          duration: 2000,
        });

        this.ngOnInit();
      } else {
        this.snackBar.open('Something wrong unable to update', 'Close', {
          duration: 3000,
        });
      }
    });
  }
}

import { Component, OnInit, ViewChild } from '@angular/core';
import { ProductService } from './product.service';
import {
  AbstractControl,
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
  ValidationErrors,
  FormGroupDirective,
} from '@angular/forms';
import * as fileSaver from 'file-saver';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import * as S3 from 'aws-sdk/clients/s3';
import Swal from 'sweetalert2';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HighlightSpanKind } from 'typescript';
import { AuthenticationService } from '../auth/authentication.service';
import { environment } from '../../environments/environment';
export interface ManageCustoData {
  sno: any;
  product_name: any;
  product_id: any;
  category: string;
  sku: any;
}
let ELEMENT_DATA: ManageCustoData[] = [];

@Component({
  selector: 'app-manage-orders',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
})
export class ProductComponent implements OnInit {
  public product_form: FormGroup;
  public edit_Productform: FormGroup;
  displayedColumns: string[] = [
    'sno',
    'imageUrl',
    'product_code',
    'product_name',
    'Product_category',
    'Product_sku',
    'action',
  ];
  dataSource = new MatTableDataSource<ManageCustoData>(ELEMENT_DATA);
  GetProduct: any;
  ProdTable: MatTableDataSource<any>;
  @ViewChild(FormGroupDirective) formGroupDirective: FormGroupDirective;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  files: any[];
  submitted = false;
  //Form Fields
  Getproduct_resp: any[];
  //Form Validation objects
  productid_req: boolean = true;
  selectedFile: File;
  Getcategory: any[];
  selectedCategory: any;
  selectedSubCategory: any;
  Getsubcategory: any[];
  showProduct_table: boolean = true;
  showEdit: boolean = false;
  form: FormGroup;
  imgType: boolean = true;
  imgUrl: string;
  profile_name: any;
  showBulkupload_product: boolean = true;
  showView: boolean = false;
  GetSingleProduct_list: any;
  product_code: any[];
  product_name: any;
  category: any;
  profile_pic: any;
  subcategory: any;
  price: any;
  tax: any;
  sku: any;
  count: any;
  description: any;
  tax_amt: any = '7.5';
  item_image: string;
  item_id: any;
  selected_file: string;
  constructor(
    private productService: ProductService,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private router: Router,
    private Spinner: NgxSpinnerService,
    private dialog: MatDialog,
    private authenticationService: AuthenticationService
  ) {}

  ngOnInit(): void {
    this.tax_amt = 7.5;
    this.Spinner.show();
    this.authenticationService.getProduct().subscribe((response) => {
      this.Spinner.hide();
      this.GetProduct = [];
      if (response['status'] == 'ok') {
        response['data'].forEach((resp: any, index: any) => {
          let obj = {
            sno: index + 1,
            id: resp['item'].id,
            product_code: resp.item_code,
            product_name: resp['item'].item_name,
            Product_category: resp['item']['category'].category_name,
            product_price: resp.item_selling_price,
            Product_sku: resp.item_sku,
            product_img: resp['item'].item_image,
          };
          this.GetProduct.push(obj);
        });
      }
      ELEMENT_DATA = this.GetProduct;
      this.ProdTable = new MatTableDataSource(this.GetProduct);
      setTimeout(() => (this.ProdTable.paginator = this.paginator));
      setTimeout(() => (this.ProdTable.sort = this.sort));
    });
    this.product_form = this.formBuilder.group({
      product_id: ['', [Validators.required, UsernameValidator.cannotContainSpace]],
      product_name: ['', [Validators.required, UsernameValidator.cannotContainSpace]],
      category: ['', Validators.required],
      sub_category: ['', Validators.required],
      sku: ['', [Validators.required, UsernameValidator.cannotContainSpace]],
      description: ['', [Validators.required, UsernameValidator.cannotContainSpace]],
      price: ['', [Validators.required]],
      tax: ['', [Validators.required]],
      count: ['', [Validators.required]],
    });

    this.edit_Productform = this.formBuilder.group({
      product_code: ['', [Validators.required, UsernameValidator.cannotContainSpace]],
      product_name: ['', [Validators.required, UsernameValidator.cannotContainSpace]],
      description: ['', [Validators.required]],
      category: ['', [Validators.required]],
      subcategory: ['', [Validators.required]],
      price: ['', [Validators.required]],
      sku: ['', [Validators.required]],
      profile_pic: ['', [Validators.required]],
      tax: ['', [Validators.required]],
      count: ['', [Validators.required]],
    });
    this.Spinner.show();
    this.authenticationService.getCategory().subscribe((response) => {
      this.Spinner.hide();
      this.Getcategory = [];
      if (response['status'] == 'ok') {
        this.Getcategory = response['data'];
      }
    });
  }
  get f() {
    return this.product_form.controls;
  }
  get s() {
    return this.edit_Productform.controls;
  }
  onKeydown(event: any) {
    if (event.keyCode === 32) {
      return false;
    }
  }
  createProduct() {
    if (this.product_form.valid) {
      let product_req = {
        item_code: this.product_form.value.product_id,
        item_name: this.product_form.value.product_name,
        category_name: this.product_form.value.category,
        subcategory_name: this.product_form.value.sub_category,
        item_description: this.product_form.value.description,
        item_image: '',
        item_sku: this.product_form.value.sku,
        item_price: this.product_form.value.price,
        item_tax: this.product_form.value.tax,
        item_count: this.product_form.value.count,
        item_discount_percent: '0',
      };
      this.Spinner.show();
      this.authenticationService.create_product(product_req).subscribe((response) => {
        this.Getproduct_resp = [];
        this.Spinner.hide();
        if (response['status'] == 'ok') {
          this.snackBar.open(response['data'], 'Close', {
            duration: 2000,
          });
          this.product_form.reset();
          this.submitted = false;
          this.ngOnInit();
          this.tax_amt = 7.5;
        } else {
          this.snackBar.open(response['data'], 'Close', {
            duration: 2000,
          });
        }
      });
    }
    this.submitted = true;
  }
  updateProduct() {
    this.submitted = false;
    this.product_form.reset();
    if (this.edit_Productform.valid) {
      if (this.imgUrl != undefined) {
        this.item_image = this.imgUrl;
      } else {
        this.item_image = this.edit_Productform.value.profile_pic;
      }
      let send_update_value = {
        item_code: this.edit_Productform.value.product_code,
        item_name: this.edit_Productform.value.product_name,
        category_name: this.edit_Productform.value.category,
        subcategory_name: this.edit_Productform.value.subcategory,
        item_description: this.edit_Productform.value.product_code,
        item_image: this.item_image,
        item_sku: this.edit_Productform.value.sku,
        item_price: this.edit_Productform.value.price,
        item_tax: this.edit_Productform.value.tax,
        item_count: this.edit_Productform.value.count,
        item_discount_percent: '0',
      };

      this.Spinner.show();
      this.authenticationService.update_product(this.item_id, send_update_value).subscribe((data) => {
        this.Spinner.hide();

        if (data['status'] == 'ok') {
          this.snackBar.open('Product Updated Successfully', 'Close', {
            duration: 2000,
          });
          this.selectedFile = null;
          this.showProduct_table = true;
          this.showEdit = false;
          this.showView = false;
          this.showBulkupload_product = true;
          this.submitted = false;
          this.ngOnInit();
        } else {
          this.snackBar.open(data['data'], 'Close', {
            duration: 3000,
          });
        }
      });
    }
    this.submitted = true;
  }
  onFileSelect_img(event: any) {
    this.selectedFile = null;
    this.selectedFile = <File>event.target.files[0];
    if (
      event.target.files[0].type === 'image/jpeg' ||
      event.target.files[0].type === 'image/png' ||
      event.target.files[0].type === 'image/jpg'
    ) {
      this.imgType = true;
      this.ew_method(this.selectedFile);
    } else {
      this.imgType = false;
    }
    this.profile_name = this.selectedFile.name;
  }
  ew_method(name: any) {
    // this.uiLoader.start();
    this.checkImage();
    var self = this;
    const bucket = new S3({
      accessKeyId: environment.S3_accessKeyId,
      secretAccessKey: environment.S3_secretAccessKey,
      region: environment.S3_region,
    });
    const contentType = name.type;
    const params = {
      Bucket: environment.S3_bucket,
      Key: name.name,
      Body: name,
      ACL: 'public-read',
      ContentType: contentType,
    };
    bucket.upload(params, function (err: any, data: any) {
      if (err) {
        return false;
      } else {
        self.imgUrl = data.Location;
        return true;
      }
    });
  }
  checkImage() {
    if (!this.imgUrl) {
      this.Spinner.show();
      setTimeout(() => {
        this.checkImage();
      }, 2000);
    } else
      setTimeout(() => {
        this.Spinner.hide();
      }, 100);
  }
  cancel() {
    this.showProduct_table = true;
    this.showEdit = false;
    this.showView = false;
    this.showBulkupload_product = true;
    this.ngOnInit();
  }
  cancel_view() {
    this.showProduct_table = true;
    this.showEdit = false;
    this.showBulkupload_product = true;
    this.showView = false;
    this.ngOnInit();
  }
  downloadFile() {
    this.authenticationService.fileDownload().subscribe((response) => {
      let blob: any = new Blob([response], { type: 'text/csv;charset=utf-8' });
      const url = window.URL.createObjectURL(blob);
      fileSaver.saveAs(blob, 'product.csv');
    });
  }

  onFileSelect(event: any) {
    this.selected_file = '';
    this.selectedFile = <File>event.target.files[0];
    if (
      this.selectedFile.type === '.csv' ||
      this.selectedFile.type === 'application/vnd.ms-excel' ||
      this.selectedFile.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ) {
    } else {
      this.snackBar.open('Could you please upload CSV file', 'Close', {
        duration: 3000,
      });
      return false;
    }
    this.authenticationService.product_Bulkupload(this.selectedFile).subscribe((response) => {
      if (response['status'] == 'ok') {
        this.snackBar.open(response['data'], 'Close', {
          duration: 2000,
        });
        this.ngOnInit();
      } else {
        this.snackBar.open(response['data'], 'Close', {
          duration: 2000,
        });
      }
    });
  }

  onFileChange(pFileList: File[]) {
    this.files = Object.keys(pFileList).map((key) => pFileList[key]);
    this.authenticationService.product_Bulkupload(this.files[0]).subscribe((response) => {
      if (response['status'] == 'ok') {
        this.snackBar.open(response['data'], 'Close', {
          duration: 2000,
        });
        this.ngOnInit();
      } else {
        this.snackBar.open(response['data'], 'Close', {
          duration: 2000,
        });
      }
    });
  }
  onOptionsSelected(event: any) {
    //const value = event.target.value;
    this.authenticationService.getSubCategory(event.value).subscribe((response) => {
      this.Getsubcategory = [];
      if (response['status'] == 'ok') {
        this.Getsubcategory = response['data'];
      }
    });
  }
  editSubcategorySelection(event: any) {
    this.authenticationService.getSubCategory(event).subscribe((response) => {
      this.Getsubcategory = [];
      if (response['status'] == 'ok') {
        this.Getsubcategory = response['data'];
      }
    });
  }
  editProduct(code: any, name: any) {
    this.submitted = false;
    this.product_form.reset();
    this.showProduct_table = false;
    this.showEdit = true;
    this.showBulkupload_product = false;
    this.Spinner.show();

    this.authenticationService.getSingleProduct(code).subscribe((response) => {
      this.Spinner.hide();
      //let categories=response['data']['item']['category'].category_name;
      this.editSubcategorySelection(response['data']['item']['category'].category_name);
      this.GetSingleProduct_list = [];
      if (response['status'] == 'ok') {
        this.item_id = response['data']['item'].id;
        this.edit_Productform = this.formBuilder.group({
          product_code: [response['data'].item_code],
          product_name: [response['data']['item'].item_name],
          category: [response['data']['item']['category'].category_name],
          subcategory: [response['data']['item']['sub_category'].category_name],
          profile_pic: [response['data']['item'].item_image],
          price: [response['data'].item_price],
          tax: [response['data'].item_tax],
          sku: [response['data'].item_sku],
          count: [response['data'].item_count],
          description: [response['data']['item'].item_description],
        });
      }
    });
  }
  deleteProduct(code: any) {
    Swal.fire({
      title: 'Are You Sure to Delete?',
      showCancelButton: true,
      confirmButtonText: 'Yes!',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.value) {
        this.Spinner.show();
        this.authenticationService.deleteSingleProduct(code).subscribe((response) => {
          this.Spinner.hide();
          if (response['status'] == 'ok') {
            Swal.fire('Success', ' Product Deleted Successfully', 'success');
            this.ngOnInit();
            return;
          } else {
            Swal.fire('Failure', response['data'], 'error');
          }
        });
      }
    });
  }
  viewProduct(code: any, name: any) {
    this.showProduct_table = false;
    this.showEdit = false;
    this.showView = true;
    this.showBulkupload_product = false;
    this.Spinner.show();
    this.authenticationService.getSingleProduct(code).subscribe((response) => {
      this.Spinner.hide();
      this.GetSingleProduct_list = [];
      if (response['status'] == 'ok') {
        this.product_code = [response['data'].item_code];
        this.product_name = [response['data']['item'].item_name];
        this.category = [response['data']['item']['category'].category_name];
        this.subcategory = [response['data']['item']['sub_category'].category_name];
        this.profile_pic = [response['data']['item']['item_image']];
        this.price = [response['data'].item_price];
        this.tax = [response['data'].item_tax];
        this.sku = [response['data'].item_sku];
        this.count = [response['data'].item_count];
        this.description = [response['data']['item'].item_description];
      }
    });
  }
}
export class UsernameValidator {
  static cannotContainSpace(control: AbstractControl): ValidationErrors | null {
    var value = control.value?.trim();
    if (value == 0) {
      return { cannotContainSpace: true };
    }
    return null;
  }
}

import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, NgZone } from '@angular/core';
import { AuthenticationService } from '@app/auth';
import { Router } from '@angular/router';
import { ProfileService } from '../../app/profile/profile.service';
import { NgxSpinnerService } from 'ngx-spinner';
import * as S3 from 'aws-sdk/clients/s3';
import { MapsAPILoader } from '@agm/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonService } from '../common/common.service';
import { threadId } from 'worker_threads';
import { NotificationService } from '../notifications/notifications.service';
import { environment } from '../../environments/environment';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  @ViewChild('search', { static: true }) searchAddElementRef: ElementRef;
  Getprofile: any[];
  Name: any;
  Address: any;
  email: any;
  phone_no: any;
  profile_name: any;
  selectedFile: File;
  imgType: boolean = true;
  imgUrl: string;
  geoCoder: any;
  latitude: any;
  longitude: any;
  zoom: number = 5;
  address: string;
  profilePic: any = [];
  profileName: any;
  GetOrders: any[];
  branch_name: any;
  branch_address: any;
  branch_description: any;
  Getcustomer: any[];
  Getcustomer_count: any;
  GetOrders_count: any;
  device: boolean = false;
  isDisabled = true;
  GetNotification: any[];
  notifyBadge: string;
  zipcode: any;
  store_image: any;
  profile_img: string;
  validname: boolean = true;
  validemail: boolean = true;
  validaddress: boolean = true;
  validphoneno: boolean = true;
  validzipcode: boolean = true;
  imagestore: any = [];
  store_img: any = '';
  prof_img: any = '';
  storeimg: boolean = false;
  selectedstore: File;
  validshopname: boolean = true;
  constructor(
    private authenticationService: AuthenticationService,
    private router: Router,
    private ProfileService: ProfileService,
    private Spinner: NgxSpinnerService,
    private ngZone: NgZone,
    private mapsAPILoader: MapsAPILoader,
    private snackBar: MatSnackBar,
    private CommonService: CommonService,
    private NotificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.isDisabled = true;
    this.CommonService.Notify_count.subscribe((count) => (this.notifyBadge = count));
    this.CommonService.profilePic.subscribe((res) => {
      this.profilePic = res;
    });
    this.CommonService.name.subscribe((res) => {
      this.profileName = res;
    });
    this.ngZone.run(() => {
      this.mapsAPILoader.load().then(() => {
        this.geoCoder = new google.maps.Geocoder();
        this.zoom = 12;
        this.ngZone.run(() => {
          let autocomplete = new google.maps.places.Autocomplete(this.searchAddElementRef.nativeElement, {});

          autocomplete.addListener('place_changed', () => {
            this.ngZone.run(() => {
              //get the place result
              let place: google.maps.places.PlaceResult = autocomplete.getPlace();
              //verify result
              if (place.geometry === undefined || place.geometry === null) {
                return;
              }
              //set latitude, longitude and zoom
              this.latitude = place.geometry.location.lat();
              this.longitude = place.geometry.location.lng();
              this.Address = place.formatted_address;
              let tempcity: any;
              let temppostal_code: any;
              let tempcountry: any;
              let tempstate: any;
              place.address_components.forEach(function (element2: any) {
                element2.types.forEach(function (element3: any) {
                  switch (element3) {
                    case 'postal_code':
                      temppostal_code = element2.long_name;
                      break;
                    case 'administrative_area_level_1':
                      tempstate = element2.long_name;
                      break;
                    case 'locality':
                      tempcity = element2.long_name;
                      break;
                    case 'country':
                      tempcountry = element2.short_name;
                      break;
                  }
                });
              });
            });
          });
        });
      });
    });
    this.Spinner.show();
    this.authenticationService.GetProfile().subscribe((response) => {
      this.Spinner.hide();
      this.Getprofile = [];
      if (response['status'] == 'ok') {
        this.Getprofile = response['data'];
        this.Name = response['data'].first_name;
        this.Address = response['data'].address;
        this.email = response['data'].email;
        this.latitude = response['data'].latitude;
        this.longitude = response['data'].longitude;
        this.phone_no = response['data'].phone_number;
        this.branch_name = response['data'].branch[0].branch_name;
        this.branch_address = response['data'].branch[0].branch_address;
        this.branch_description = response['data'].branch[0].branch_description;
        this.profile_name = response['data'].photo;
        this.zipcode = response['data'].branch[0].zipcode;
        this.store_image = response['data'].branch[0].photo;
        this.store_img = response['data'].branch[0].photo;
      }
    });
    this.Spinner.show();
    this.authenticationService.GetCustomer().subscribe((response) => {
      this.Spinner.hide();
      this.Getcustomer = [];
      if (response['status'] == 'ok') {
        this.Getcustomer_count = response['data'].length;
      }
    });
    this.Spinner.show();
    this.authenticationService.getOrders().subscribe((response) => {
      this.Spinner.hide();
      this.GetOrders = [];
      if (response['status'] == 'ok') {
        this.GetOrders_count = response['data'].length;
      }
    });
    this.notification_list();
  }

  logout() {
    this.authenticationService.logout();
  }
  onFileSelect(event: any, inde: any) {
    this.selectedFile = null;
    this.selectedstore = null;
    this.selectedFile = <File>event.target.files[0];
    if (
      event.target.files[0].type === 'image/jpeg' ||
      event.target.files[0].type === 'image/png' ||
      event.target.files[0].type === 'image/jpg'
    ) {
      this.imgType = true;
      var reader = new FileReader();
      if (inde == 0) {
        this.selectedFile = <File>event.target.files[0];
        reader.readAsDataURL(event.target.files[0]);
        reader.onload = (event) => {
          this.profilePic = event.target.result;
        };
        this.profile_name = this.selectedFile.name;
        this.ew_method(this.selectedFile, 0);
      } else {
        this.selectedstore = <File>event.target.files[0];
        this.storeimg = true;
        reader.readAsDataURL(event.target.files[0]);
        reader.onload = (event) => {
          this.imagestore = event.target.result;
        };
        this.store_image = this.selectedstore.name;
        this.ew_method(this.selectedstore, 1);
      }
    } else {
      this.imgType = false;
      this.snackBar.open('Could you please upload image file', 'Close', {
        duration: 4000,
        verticalPosition: 'top',
      });
      return true;
    }
  }
  ew_method(name: any, id: any) {
    // this.uiLoader.start();
    //this.checkImage();
    this.Spinner.show();
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
        self.Spinner.hide();
        if (id == 0) {
          console.log(data, '1');
          self.prof_img = data.Location;
        } else {
          console.log(data, '2');
          self.store_img = data.Location;
        }
        return true;
      }
    });
  }
  omit_special_char(event: any) {
    var k;
    k = event.charCode; //         k = event.keyCode;  (Both can be used)
    return (k > 64 && k < 91) || (k > 96 && k < 123) || k == 8 || k == 32 || (k >= 48 && k <= 57);
  }
  // checkImage() {
  //   if (!this.imgUrl) {
  //     this.Spinner.show();
  //     setTimeout(() => {
  //       this.checkImage();
  //     }, 2000);
  //   } else
  //     setTimeout(() => {
  //       this.Spinner.hide();
  //     }, 100);
  // }
  profile_Update() {
    if (this.branch_name == '' || this.branch_name == undefined) {
      this.validshopname = false;
      return false;
    } else {
      this.validshopname = true;
    }
    if (this.Name == '' || this.Name == undefined) {
      this.validname = false;
      return false;
    } else {
      this.validname = true;
    }
    if (this.Address == '' || this.Address == undefined) {
      this.validaddress = false;
      return false;
    } else {
      this.validaddress = true;
    }
    if (this.phone_no == '' || this.phone_no == undefined) {
      this.validphoneno = false;
      return false;
    } else {
      this.validphoneno = true;
    }
    if (this.zipcode == '' || this.zipcode == undefined) {
      this.validzipcode = false;
      return false;
    } else {
      this.validzipcode = true;
    }

    if (this.profile_name == '') {
      this.profile_img = this.imgUrl;
    } else {
      this.profile_img = this.profile_name;
    }

    var req = {
      address: this.Address,
      latitude: this.latitude,
      longitude: this.longitude,
      phone_number: this.phone_no,
      first_name: this.Name,
      email: this.email,
      photo: this.prof_img == '' ? this.profile_name : this.prof_img,
      zipcode: this.zipcode,
      store_img: this.store_img,
      shop_name: this.branch_name,
    };
    this.Spinner.show();
    this.authenticationService.UpdateProfile(req).subscribe((response) => {
      this.Spinner.hide();
      this.Getprofile = [];
      if (response['status'] == 'ok') {
        localStorage.setItem('profileName', this.Name);
        if (this.prof_img) {
          localStorage.setItem('profilePic', this.prof_img);
        }
        if (this.store_img) {
          localStorage.setItem('storeimg', this.store_img);
        }
        this.profile_name = localStorage.getItem('profilePic');
        this.ngOnInit();
        this.CommonService.updateIdentity(localStorage.getItem('profilePic'), localStorage.getItem('profileName'));
        this.snackBar.open(response['data'], 'Close', {
          duration: 4000,
          verticalPosition: 'top',
        });
      }
    });
  }

  OnlyNumbers(event: any) {
    let regex: RegExp = new RegExp(/^[0-9]{1,}$/g);
    let specialKeys: Array<string> = ['Backspace', 'Tab', 'End', 'Home', 'ArrowRight', 'ArrowLeft'];
    if (specialKeys.indexOf(event.key) !== -1) {
      return;
    } else {
      if (regex.test(event.key)) {
        return true;
      } else {
        return false;
      }
    }
  }
  notification_list() {
    this.Spinner.show();
    this.authenticationService.GetNotification().subscribe((response) => {
      this.Spinner.hide();
      this.GetNotification = [];
      if (response['status'] == 'ok') {
        response['data'].forEach((notify: any, index: any) => {
          let obj = {
            sno: index + 1,
            title: notify['title'],
            desc: notify['description'],
            order_id: notify['order_id'],
            created_on: notify['created_on'],
            id: notify['id'],
          };
          this.GetNotification.push(obj);
        });
      }
    });
  }
}

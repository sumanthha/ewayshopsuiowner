import { Component, OnInit, NgZone, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { PrivacyService } from './privacy.service';
import { MapsAPILoader } from '@agm/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgxSpinnerService } from 'ngx-spinner';
@Component({
  selector: 'app-sign-up',
  templateUrl: './privacy.component.html',
  styleUrls: ['./privacy.component.scss'],
})
export class PrivacyComponent implements OnInit {
  @ViewChild('search', { static: true }) searchAddElementRef: ElementRef;
  public signup_form: FormGroup;
  latitude: any;
  longitude: any;
  address: any;
  geoCoder: google.maps.Geocoder;
  zoom: number;
  constructor(
    private Spinner: NgxSpinnerService,
    private mapsAPILoader: MapsAPILoader,
    private snackBar: MatSnackBar,
    private ngZone: NgZone,
    private PrivacyService: PrivacyService,
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder
  ) {}
  isLoading = false;
  submitted = false;
  ngOnInit(): void {
    this.signup_form = this.formBuilder.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],

      location: ['', Validators.required],
      phoneno: ['', Validators.required],
      branch_name: ['', Validators.required],
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
              this.address = place.formatted_address;
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
  }
  back() {
    this.router.navigate(['signup']);
  }
  signup() {
    // this.submitted = true;
    if (this.signup_form.valid) {
      let data = {
        branch_name: this.signup_form.value.branch_name,
        email: this.signup_form.value.email,
        first_name: this.signup_form.value.name,
        phone_number: this.signup_form.value.phoneno,
        address: this.signup_form.value.location,
        latitude: this.latitude,
        longitude: this.longitude,
      };
      this.Spinner.show();
      this.PrivacyService.Signup(data).subscribe((response) => {
        this.Spinner.hide();
        if (response['status'] == 'ok') {
          this.signup_form.reset();
          this.snackBar.open('Store Registered Successfully', 'Close', {
            duration: 5000,
            verticalPosition: 'top',
          });
        } else {
          this.snackBar.open(response['message'], 'Close', {
            duration: 4000,
            verticalPosition: 'top',
          });
        }
      });
    }
    this.submitted = true;
  }
  get f() {
    return this.signup_form.controls;
  }
}

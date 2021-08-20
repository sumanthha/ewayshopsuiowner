import { Component, OnInit, NgZone, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { SignupService } from './sign-up.service';
import { MapsAPILoader } from '@agm/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgxSpinnerService } from 'ngx-spinner';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
})
export class SignUpComponent implements OnInit {
  @ViewChild('search', { static: true }) searchAddElementRef: ElementRef;
  public signup_form: FormGroup;
  latitude: any;
  longitude: any;
  address: any;
  geoCoder: google.maps.Geocoder;
  zoom: number;
  city: any;
  state: any;
  phone_no: any;
  constructor(
    private Spinner: NgxSpinnerService,
    private mapsAPILoader: MapsAPILoader,
    private snackBar: MatSnackBar,
    private ngZone: NgZone,
    private SignupService: SignupService,
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder
  ) {}
  isLoading = false;
  submitted = false;
  ngOnInit(): void {
    this.signup_form = this.formBuilder.group({
      name: ['', [Validators.required, this.noWhitespaceValidator]],
      email: ['', [Validators.required, Validators.email]],
      terms: [false, Validators.requiredTrue],
      location: ['', Validators.required],
      phoneno: ['', Validators.required],
      branch_name: ['', Validators.required],
      zipcode: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
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
                      console.log(tempstate, 'state');
                      break;
                    case 'locality':
                      tempcity = element2.long_name;
                      console.log(tempcity, 'tempcity');
                      break;
                    case 'country':
                      tempcountry = element2.short_name;
                      console.log(tempcountry, 'tempcountry');
                      break;
                  }
                });
              });
              this.state = tempstate;
              this.city = tempcity;
            });
          });
        });
      });
    });
  }
  termandconditions() {
    this.router.navigate(['termandconditions']);
  }
  privacy() {
    this.router.navigate(['privacy']);
  }
  signup() {
    if (this.latitude == undefined) {
      this.latitude = '';
    }
    if (this.longitude == undefined) {
      this.longitude = '';
    }
    // this.submitted = true;
    let country_code = '+1';
    if (this.signup_form.valid) {
      let data = {
        branch_name: this.signup_form.value.branch_name,
        email: this.signup_form.value.email,
        first_name: this.signup_form.value.name,
        phone_number: country_code + this.signup_form.value.phoneno,
        address: this.signup_form.value.location,
        latitude: this.latitude,
        longitude: this.longitude,
        zipcode: this.signup_form.value.zipcode,
        state: this.signup_form.value.state,
        city: this.signup_form.value.city,
      };

      this.Spinner.show();
      this.SignupService.Signup(data).subscribe((response) => {
        this.Spinner.hide();
        if (response['status'] == 'ok') {
          Swal.fire(
            'Registration Successfull',
            'An email has been sent to your account.Can you check your e-mail and reset your password',
            'success'
          );
          this.router.navigate(['login']);
          return;
        } else {
          this.snackBar.open(response['data'], 'Close', {
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
  omit_special_char(event: any) {
    var k;
    k = event.charCode; //         k = event.keyCode;  (Both can be used)
    return (k > 64 && k < 91) || (k > 96 && k < 123) || k == 8 || k == 32 || (k >= 48 && k <= 57);
  }

  public noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { whitespace: true };
  }
}

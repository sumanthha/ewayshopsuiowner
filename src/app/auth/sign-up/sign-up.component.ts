import { Component, OnInit, NgZone, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, AbstractControl, ValidationErrors } from '@angular/forms';
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
  showlocation: boolean = true;
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
      name: ['', [Validators.required, UsernameValidator.cannotContainSpace]],
      email: ['', [Validators.required, UsernameValidator.cannotContainSpace]],
      terms: [false, Validators.requiredTrue],
      location: ['', [Validators.required, UsernameValidator.cannotContainSpace]],
      phoneno: ['', [Validators.required, UsernameValidator.cannotContainSpace]],
      branch_name: ['', [Validators.required, UsernameValidator.cannotContainSpace]],
      zipcode: ['', [Validators.required, UsernameValidator.cannotContainSpace]],
      city: ['', [Validators.required, UsernameValidator.cannotContainSpace]],
      state: ['', [Validators.required, UsernameValidator.cannotContainSpace]],
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
    if (this.signup_form.value.location == undefined) {
      this.showlocation = false;
      return false;
    } else {
      this.showlocation = true;
      if (this.latitude == '' && this.longitude == '') {
        this.showlocation = false;
        return false;
      }
    }
    if (this.signup_form.valid) {
      let data = {
        branch_name: this.signup_form.value.branch_name.replace(/\s/g, ''),
        email: this.signup_form.value.email.replace(/\s/g, ''),
        first_name: this.signup_form.value.name.replace(/\s/g, ''),
        phone_number: country_code + this.signup_form.value.phoneno.replace(/\s/g, ''),
        address: this.signup_form.value.location,
        latitude: this.latitude,
        longitude: this.longitude,
        zipcode: this.signup_form.value.zipcode.replace(/\s/g, ''),
        state: this.signup_form.value.state.replace(/\s/g, ''),
        city: this.signup_form.value.city.replace(/\s/g, ''),
      };

      this.Spinner.show();
      this.SignupService.Signup(data).subscribe((response) => {
        this.Spinner.hide();
        if (response['status'] == 'ok') {
          Swal.fire(
            'Registration Successfully',
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

  public noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { whitespace: true };
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

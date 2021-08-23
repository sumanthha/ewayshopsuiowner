import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '@env/environment';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ForgetPasswordService } from './forget-rest.service';
import { NgxSpinnerService } from 'ngx-spinner';
@Component({
  selector: 'app-forget-reset',
  templateUrl: './forget-reset.component.html',
  styleUrls: ['./forget-reset.component.scss'],
})
export class ForgetResetComponent implements OnInit {
  public forgotForm: FormGroup;
  public resetForm: FormGroup;
  accesstoken: any;
  password: any;
  confirm_password: any;
  isLoading = false;
  reset_id: any;
  //show forgot password form
  show_forget_form = false;
  //reset form show
  show_reset_form = false;
  //reset success mesasage div
  reset_success = false;
  //mail send mesage
  link_send_message = false;
  checkRoute: any;
  show_password_form: boolean;
  show: boolean = false;
  showConfirm: boolean = false;
  submitted = false;
  show_button: Boolean = false;
  show_button1: Boolean = false;
  constructor(
    private Spinner: NgxSpinnerService,
    private ForgetPasswordService: ForgetPasswordService,
    private snackBar: MatSnackBar,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.password = 'password';
    this.confirm_password = 'conpassword';
    this.accesstoken = this.route.snapshot.paramMap.get('id');
    // this.route.params.subscribe((paramsId) => {
    //   console.log(this.route.params, 'paramsIdparamsIdparamsId');
    //   console.log(this.route, 'dfsxfdvxcvcv');
    //   this.accesstoken = paramsId.id;
    // });
    // this.checkRoute = this.route.snapshot.paramMap.get('slug');
    // console.log(this.checkRoute)
    // if (this.checkRoute == 'reset-password') {
    this.show_reset_form = true;
    this.show_forget_form = false;
    this.show_password_form = false;
    // } else if (this.checkRoute == 'forgot-password') {
    //   this.show_forget_form = true;
    //   this.show_reset_form = false;
    //   this.show_password_form = false;
    // } else if (this.checkRoute == 'password-set') {
    //   this.show_password_form = true;
    //   this.show_forget_form = false;
    //   this.show_reset_form = false;
    // }
    //forgot form
    this.forgotForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
    });
    //reset form
    this.resetForm = this.formBuilder.group({
      // email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      confirm_password: ['', [Validators.required, confirmPasswordValidator]],
    });
  }
  //return from values for validation
  get f() {
    return this.forgotForm.controls;
  }
  get r() {
    return this.resetForm.controls;
  }
  showPass() {
    this.show_button = !this.show_button;
    this.show = !this.show;
  }
  showConfpass() {
    this.showConfirm = !this.showConfirm;
    this.show_button1 = !this.show_button1;
  }
  reset() {
    if (this.resetForm.valid) {
      this.link_send_message = true;
      this.show_reset_form = false;

      // const data = new FormData();
      // data.append('password', this.resetForm.value.confirm_password)
      // data.append('jwt_token', this.accesstoken)
      this.Spinner.show();
      this.ForgetPasswordService.reset_Password(this.resetForm.value.confirm_password, this.accesstoken).subscribe(
        (response) => {
          this.Spinner.hide();
          if (response['status'] == 'ok' && response['http_code'] == 200) {
            this.router.navigate(['login']);
            this.reset_success = true;
            this.snackBar.open('Your password has been successsfully reset', 'Close', {
              duration: 5000,
              verticalPosition: 'top',
            });
          } else {
            this.show_reset_form = true;
            this.snackBar.open('Password could not be reset', 'Close', {
              duration: 4000,
              verticalPosition: 'top',
            });
          }
        },
        (error) => {
          this.snackBar.open('Password could not be reset', 'Close', {
            duration: 4000,
            verticalPosition: 'top',
          });
        }
      );
    }
    this.submitted = true;
  }
}

//CONFIRM PASSWORD CUSTOM VALIDATION
export const confirmPasswordValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  if (!control.parent || !control) {
    return null;
  }
  const password = control.parent.get('password');
  const passwordConfirm = control.parent.get('confirm_password');
  if (!password || !passwordConfirm) {
    return null;
  }
  if (passwordConfirm.value === '') {
    return null;
  }
  if (password.value === passwordConfirm.value) {
    return null;
  }
  return { passwordsNotMatching: true };
};

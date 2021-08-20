import { Component, OnInit } from '@angular/core';
import { ValidatorFn, AbstractControl, ValidationErrors, Validators, FormBuilder, FormGroup } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { ForgetService } from './forgot-rest.service';
import { AuthenticationService} from '../authentication.service'
@Component({
  selector: 'app-forgotpass',
  templateUrl: './forgotpass.component.html',
  styleUrls: ['./forgotpass.component.scss'],
})
export class ForgotpassComponent implements OnInit {
  public forgotForm: FormGroup;
  public resetForm: FormGroup;
  accesstoken: any;
  password: any;
  isLoading = false;
  //show forgot password form
  show_forget_form = true;
  //reset form show
  show_reset_form = false;
  //reset success mesasage div
  reset_success = false;
  //mail send mesage
  link_send_message = false;
  checkRoute: any;
  show_password_form: boolean;

  constructor(
    private Spinner: NgxSpinnerService,
    private ForgetPasswordService: ForgetService,
    private snackBar: MatSnackBar,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService:AuthenticationService
  ) {}

  ngOnInit(): void {
    this.password = 'password';

    //forgot form
    this.forgotForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }
  //return from values for validation
  get f() {
    return this.forgotForm.controls;
  }
  cancel() {
    this.router.navigate(['/login']);
  }

  forgotPassword() {
    if (this.forgotForm.valid) {
      this.Spinner.show();
      this.authenticationService.forgot_Password(this.forgotForm.value.email).subscribe(
        (response) => {
          this.Spinner.hide();
          if (response['status'] == 'ok') {
            this.snackBar.open('Reset Link sent to your e-mail', 'Close', {
              duration: 4000,
              verticalPosition: 'top',
            });
            this.router.navigateByUrl('login');
          } else {
            this.snackBar.open('Sorry,not able to send reset link', 'Close', {
              duration: 4000,
              verticalPosition: 'top',
            });
          }
        },
        (error) => {
          this.snackBar.open('Sorry,not able to send reset link', 'Close', {
            duration: 4000,
            verticalPosition: 'top',
          });
        }
      );
    }
    this.isLoading = true;
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

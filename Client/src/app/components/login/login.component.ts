import { Component, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, NgForm, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import * as moment from 'moment';
import '../../extensions/moment-extensions';
import { AccountService } from 'src/app/services/account.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  @ViewChild('loginForm') loginForm!: NgForm;
  loginModel = { username: '', password: '' };
  hidePass = true;
  registerForm!: FormGroup;

  constructor(private accountService: AccountService,
    private router: Router,
    private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.initializeRegisterForm();
  }

  initializeRegisterForm() {
    this.registerForm = this.formBuilder.group({
      username: ['', [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(15),
        Validators.pattern('[a-z0-9.]*')
      ]],
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(30)]],
      confirmPassword: ['', [Validators.required]],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', Validators.email],
      phoneNumber: ['', Validators.pattern('[0-9]*')],
      dateOfBirth: ['']
    }, { validators: this.matchPassValidator })
  }

  login() {
    this.accountService.login(this.loginModel).subscribe(() => {
      this.loginForm.reset();
      this.router.navigateByUrl('dashboard');
    });
  }

  register() {
    let formValue = { ...this.registerForm.value };
    for (let prop in formValue) {
      if (!formValue[prop]) {
        delete formValue[prop];
      }
    }

    if (formValue['dateOfBirth']) {
      formValue['dateOfBirth'] = moment(formValue['dateOfBirth']).format('YYYY-MM-DD');
    }
    
    // console.log(this.registerForm.value);
    // console.log(formValue);

    this.accountService.register(formValue).subscribe(() => {
      this.registerForm.reset();
      this.router.navigateByUrl('dashboard');
    });
  }

  getErrors(prop: string): string {
    let c = this.registerForm.controls[prop];

    if (c.errors?.required) {
      return 'Field is required';
    }

    if (c.errors?.minlength) {
      return 'Minimum of ' + c.errors.minlength.requiredLength + ' chars are required';
    }

    if (c.errors?.maxlength) {
      return 'Maximum of ' + c.errors.maxlength.requiredLength + ' chars are required';
    }

    if (c.errors?.email) {
      return 'Invalid email';
    }

    if (c.errors?.matDatepickerParse) {
      return 'Invalid date';
    }

    if (c.errors?.pattern) {
      if (prop === 'phoneNumber') {
        return 'Invalid phone number'
      }
      if (prop === 'username') {
        return 'Allowed characters: [a-z], [0-9], [.]';
      }
    }

    if (c.errors?.noMatch) {
      return 'Confirm password must macth password';
    }

    return '';
  }

  matchPassValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const pass = control.get('password');
    const cpass = control.get('confirmPassword');

    if (pass && cpass && pass.value !== cpass.value) {
      cpass.setErrors({ noMatch: true });
    } else {
      if (cpass?.hasError('noMatch')) {
        delete cpass?.errors?.['noMatch'];
        cpass.updateValueAndValidity();
      }
    }
    return null;
  }
}

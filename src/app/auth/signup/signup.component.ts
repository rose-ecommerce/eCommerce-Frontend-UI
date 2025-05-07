import { 
  Component,
  OnDestroy,
  OnInit
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
import {
  Router
} from '@angular/router';
import {
  takeWhile
} from 'rxjs';
import {
  AddressModel,
  AuthBrokerService,
  AuthLoaderService,
  AuthState,
  COUNTRY_DATA,
  EMAIL_REGEX,
  UserModel
} from 'src/core';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit, OnDestroy {
  public signupFormGroup!: FormGroup;
  public addressFormGroup!: FormGroup;
  public emailFormControl!: FormControl;
  public passwordFormControl!: FormControl;
  public confirmPasswordFormControl!: FormControl;
  public phoneNumberFormControl!: FormControl;
  public consentFormControl!: FormControl;
  public streetAddressLine1FormControl!: FormControl;
  public streetAddressLine2FormControl!: FormControl;
  public streetAddressLine3FormControl!: FormControl;
  public cityFormControl!: FormControl;
  public stateFormControl!: FormControl;
  public countryFormControl!: FormControl;
  public postalCodeFormControl!: FormControl;
  public countries: Array<string> = [];
  public states: Array<string> = [];
  public showPassword: boolean = false;
  public showConfirmPassword: boolean = false; 
  private _subscribeMain: boolean = true;
  constructor(private _authBroker: AuthBrokerService,
              private _authLoader: AuthLoaderService,
              private _fb: FormBuilder,
              private _router: Router) {}

  ngOnInit(): void {
    this._createSignupForm();
    this._initSubscriptions();
  }

  ngOnDestroy(): void {
    this._subscribeMain = false;
  }

  private _initSubscriptions(): void {
    this._authLoader.authState$
      .pipe(takeWhile(() => this._subscribeMain))
      .subscribe(state => {
        if (state.name === AuthState.REGISTER && state.isSuccessful) {
          this._router.navigate(['auth', 'signin']);
        }
      });

    this.passwordFormControl.valueChanges
      .pipe(takeWhile(() => this._subscribeMain))
      .subscribe(val => {
        this.confirmPasswordFormControl.enable();
        if (val !== this.confirmPasswordFormControl.value) {
          this.confirmPasswordFormControl.setErrors({ mismatch: true });
        } else {
          this.confirmPasswordFormControl.setErrors(null);
        }
      });

    this.confirmPasswordFormControl.valueChanges
      .pipe(takeWhile(() => this._subscribeMain))
      .subscribe(val => {
        if (val !== this.passwordFormControl.value) {
          this.confirmPasswordFormControl.setErrors({ mismatch: true });
        } else if (val) {
          this.confirmPasswordFormControl.setErrors(null);
        }
      });

    this.countryFormControl.valueChanges
      .pipe(takeWhile(() => this._subscribeMain))
      .subscribe(val => {
        if (val) {
          this.stateFormControl.enable();
          this.stateFormControl.patchValue('');
          this.stateFormControl.markAsUntouched();
          this.stateFormControl.markAsPristine();
          this.states = [ ...COUNTRY_DATA[val] ];
        }
      });

    this.stateFormControl.valueChanges
      .pipe(takeWhile(() => this._subscribeMain))
      .subscribe(val => {
        if (val) {
          this.cityFormControl.enable();
          this.cityFormControl.patchValue('');
          this.cityFormControl.markAsUntouched();
          this.cityFormControl.markAsPristine();
        }
      });

    this.cityFormControl.valueChanges
      .pipe(takeWhile(() => this._subscribeMain))
      .subscribe(val => {
        if (val) {
          this.postalCodeFormControl.enable();
          this.postalCodeFormControl.patchValue('');
          this.postalCodeFormControl.markAsUntouched();
          this.postalCodeFormControl.markAsPristine();
        }
      });
  }

  private _createSignupForm(): void {
    this.countries = Object.keys(COUNTRY_DATA);
    this.addressFormGroup = this._fb.group({
      streetAddressLine1: ['', [Validators.required]],
      streetAddressLine2: [''],
      streetAddressLine3: [''],
      country: ['', [Validators.required]],
      state: [{ value: '', disabled: true }, [Validators.required]],
      city: [{ value: '', disabled: true }, [Validators.required]],
      postalCode: [{ value: '', disabled: true }, [Validators.required]]
    });

    this.signupFormGroup = this._fb.group({
      email: ['', [Validators.required, Validators.pattern(EMAIL_REGEX)]],
      password: ['', [Validators.required]],
      confirmPassword: [{ value: '', disabled: true }],
      phoneNumber: ['', [Validators.required]],
      address: this.addressFormGroup,
      consent: [false, [Validators.requiredTrue]]
    });

    this.emailFormControl = this.signupFormGroup.controls['email'] as FormControl;
    this.passwordFormControl = this.signupFormGroup.controls['password'] as FormControl;
    this.confirmPasswordFormControl = this.signupFormGroup.controls['confirmPassword'] as FormControl;
    this.phoneNumberFormControl = this.signupFormGroup.controls['phoneNumber'] as FormControl;
    this.consentFormControl = this.signupFormGroup.controls['consent'] as FormControl;
    this.streetAddressLine1FormControl = this.addressFormGroup.controls['streetAddressLine1'] as FormControl;
    this.streetAddressLine2FormControl = this.addressFormGroup.controls['streetAddressLine2'] as FormControl;
    this.streetAddressLine3FormControl = this.addressFormGroup.controls['streetAddressLine3'] as FormControl;
    this.cityFormControl = this.addressFormGroup.controls['city'] as FormControl;
    this.stateFormControl = this.addressFormGroup.controls['state'] as FormControl;
    this.countryFormControl = this.addressFormGroup.controls['country'] as FormControl;
    this.postalCodeFormControl = this.addressFormGroup.controls['postalCode'] as FormControl;
  }

  public isInputValid(inputName: string): boolean {
    let formControl: FormControl;
    switch(inputName) {
      case 'email':
        formControl = this.emailFormControl;
        break;
      case 'password':
        formControl = this.passwordFormControl;
        break;
      case 'confirmPassword':
        formControl = this.confirmPasswordFormControl;
        break;
      case 'phoneNumber':
        formControl = this.phoneNumberFormControl;
        break;
      case 'streetAddressLine1':
        formControl = this.streetAddressLine1FormControl;
        break;
      case 'streetAddressLine2':
        formControl = this.streetAddressLine2FormControl;
        break;
      case 'streetAddressLine3':
        formControl = this.streetAddressLine3FormControl;
        break;
      case 'country':
        formControl = this.countryFormControl;
        break;
      case 'state':
        formControl = this.stateFormControl;
        break;
      case 'city':
        formControl = this.cityFormControl;
        break;
      case 'postalCode':
        formControl = this.postalCodeFormControl;
        break;
      case 'consent':
        formControl = this.consentFormControl;
        break;
      default:
        formControl = new FormControl();
        break;
    }
    return formControl.touched || formControl.dirty;
  }

  public getInputValidationClasses(inputName: string): Record<string, boolean> {
    let formControl: FormControl;
    switch(inputName) {
      case 'email':
        formControl = this.emailFormControl;
        break;
      case 'password':
        formControl = this.passwordFormControl;
        break;
      case 'confirmPassword':
        formControl = this.confirmPasswordFormControl;
        break;
      case 'phoneNumber':
        formControl = this.phoneNumberFormControl;
        break;
      case 'streetAddressLine1':
        formControl = this.streetAddressLine1FormControl;
        break;
      case 'streetAddressLine2':
        formControl = this.streetAddressLine2FormControl;
        break;
      case 'streetAddressLine3':
        formControl = this.streetAddressLine3FormControl;
        break;
      case 'country':
        formControl = this.countryFormControl;
        break;
      case 'state':
        formControl = this.stateFormControl;
        break;
      case 'city':
        formControl = this.cityFormControl;
        break;
      case 'postalCode':
        formControl = this.postalCodeFormControl;
        break;
      case 'consent':
        formControl = this.consentFormControl;
        break;
      default:
        formControl = new FormControl();
        break;
    }
    return {
      'is-invalid': (formControl.touched || formControl.dirty) && !!formControl.errors,
      'is-valid': (formControl.touched || formControl.dirty) && !formControl.errors
     };
  }

  public signup(): void {
    const signupData = new UserModel(this.signupFormGroup.value);
    signupData.address = new AddressModel(this.addressFormGroup.value);
    this._authBroker.register(signupData);
  }
}

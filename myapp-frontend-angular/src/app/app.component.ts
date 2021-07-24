import { AfterViewChecked, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ReactiveFormConfig, ValidationAlphabetLocale } from '@rxweb/reactive-form-validators';
import { AuthService } from './shared/services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewChecked {
  title = 'Full-stack dev myapp';

  constructor(
    public authService: AuthService,
    private changeDetectorRef: ChangeDetectorRef,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.authService.populate();

    ReactiveFormConfig.set({
      "internationalization": {
        "dateFormat": "dmy",
        "seperator": "/"
      },
      defaultValidationLocale: {
        alpha: ValidationAlphabetLocale.spanish,
        alphaNumeric: ValidationAlphabetLocale.spanish,
        required: ValidationAlphabetLocale.vietnam,
      },
      "validationMessage": {
        "required": "This field is required",
        "compare": "Inputs are not matched.",
        "email": "Email is not valid",
        "password": {
          minLength: 'Minimum input length should be 6.',
          maxLength: 'MaxLength allowed is 20',
          password: "Should contain digit, character and special character"
        },
      }
    });
  }

  ngAfterViewChecked(): void { this.changeDetectorRef.detectChanges(); }

  get isPersonalTab(): boolean {
    if (this.router.url === '/auth/profile' || this.router.url === '/auth/change-password') {
      return true;
    }

    return false;
  }

}

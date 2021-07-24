import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { MAT_SNACK_BAR_DEFAULT_OPTIONS } from '@angular/material/snack-bar';
import { RxReactiveFormsModule } from '@rxweb/reactive-form-validators';
import { GoogleLoginProvider, SocialAuthServiceConfig } from 'angularx-social-login';
import { TagInputModule } from 'ngx-chips';
import { QuillModule } from 'ngx-quill';
import { AngularMaterialModule } from './angular-material.module';
import { BaseFormComponent } from './components/base-form/base-form.component';
import { BaseListComponent } from './components/base-list/base-list.component';
import { ConfirmDeleteDialogComponent } from './components/confirm-delete-dialog/confirm-delete-dialog.component';
import { ProgressBarComponent } from './components/progress-bar/progress-bar.component';
import { HasAnyPermissionsDirective } from './directives/has-any-permission.directive';
import { HasPermissionsDirective } from './directives/has-permissions.directive';
import { ShowAuthedDirective } from './directives/show-authed.directive';

@NgModule({
  declarations: [ProgressBarComponent, BaseFormComponent, BaseListComponent, ConfirmDeleteDialogComponent,
    ShowAuthedDirective, HasPermissionsDirective, HasAnyPermissionsDirective],
  imports: [
    CommonModule,
    AngularMaterialModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    RxReactiveFormsModule,
    QuillModule,
    TagInputModule,
  ],
  exports: [
    ProgressBarComponent,
    AngularMaterialModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    RxReactiveFormsModule,
    BaseFormComponent,
    BaseListComponent,
    ConfirmDeleteDialogComponent,
    QuillModule,
    TagInputModule,
    ShowAuthedDirective,
    HasPermissionsDirective,
    HasAnyPermissionsDirective
  ],
  providers: [
    { provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: { duration: 5000 } },
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { floatLabel: 'always' }
    },
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(
              '1043591308915-cp92iit2hhv121rqcm4tl5niq7pc8tt0.apps.googleusercontent.com'
            )
          },
          /* {
            id: FacebookLoginProvider.PROVIDER_ID,
            provider: new FacebookLoginProvider('1020631963004-j6qi8th6vlspqlvs4m5fsbh49nb3149t.apps.googleusercontent.com')
          } */
        ]
      } as SocialAuthServiceConfig,
    }
  ]
})
export class SharedModule { }

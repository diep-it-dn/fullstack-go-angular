import { Component, OnInit } from '@angular/core';
import { RxFormBuilder } from '@rxweb/reactive-form-validators';
import { Observable } from 'rxjs';
import { AbstractBaseFormComponent } from 'src/app/shared/components/base-form/abstract-base-form.component';
import { FormType } from 'src/app/shared/components/base-form/base-form.model';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { CurrentUserGQL, UpdateUserIn, User } from 'src/generated/graphql';
import { AuthService } from 'src/app/shared/services/auth.service';
import { Profile } from './profile.model';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent extends AbstractBaseFormComponent<Profile, User> implements OnInit {

  constructor(
    private authService: AuthService,
    protected formBuilder: RxFormBuilder,
    protected notificationService: NotificationService,
    private currentUserGQL: CurrentUserGQL,
  ) {
    super(formBuilder, notificationService);
    this.baseForm.type = FormType.UPDATE;
    this.baseForm.title = "User Profile";
    this.baseForm.submitName = "Update";
  }

  ngOnInit(): void {
    super.ngOnInit();

    this.currentUserGQL.fetch({}, { fetchPolicy: 'no-cache' }).subscribe(res => {
      this.form.patchValue(res.data.currentUser);
      if (this.form.get('birthday')!.value) {
        this.form.get('birthday')!.setValue(this.form.get('birthday')!.value.split('T')[0]);
      }
    });


  }

  newT(): Profile {
    return new Profile();
  }

  submit(): Observable<User> {
    const profile: Profile = this.baseForm.form.value;
    const input: UpdateUserIn = {
      displayedNameIn: {
        isUpdate: true,
        value: profile.displayedName
      },
      firstNameIn: {
        isUpdate: true,
        value: profile.firstName
      },
      lastNameIn: {
        isUpdate: true,
        value: profile.lastName
      },
      genderIn: {
        isUpdate: true,
        value: profile.gender
      },
      birthdayIn: {
        isUpdate: true,
        value: profile.birthday ? (profile.birthday + 'T00:00:00.000Z') : null
      },
      phoneNumberIn: {
        isUpdate: true,
        value: profile.phoneNumber
      },
      addressIn: {
        isUpdate: true,
        value: profile.address
      },
      descriptionIn: {
        isUpdate: true,
        value: profile.description
      },
      avatarURLIn: {
        isUpdate: true,
        value: profile.avatarURL
      }
    }
    return this.authService.updateCurrentUser(input);
  }

  afterSubmitOK(_res: User): void {
  }

}

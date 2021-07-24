import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { SetContentSettingGQL, SetContentSettingIn, ContentSettingByNameGQL } from 'src/generated/graphql';

@Component({
  selector: 'app-content-setting-details',
  templateUrl: './content-setting-details.component.html',
  styleUrls: ['./content-setting-details.component.scss']
})
export class ContentSettingDetailsComponent implements OnInit {

  @Input()
  name!: string;
  form!: FormGroup;
  loading = false;

  constructor(
    private formBuilder: FormBuilder,
    private uiContentByNameGQL: ContentSettingByNameGQL,
    private setContentSettingGQL: SetContentSettingGQL,
    private notificationService: NotificationService,
  ) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      value: ['', [Validators.required]],
    });
    this.loading = true;
    this.uiContentByNameGQL.fetch({ name: this.name }).
      pipe(
        finalize(() => {
          this.loading = false;
        })
      ).
      subscribe(res => {
        this.form.get('value')!.setValue(res.data.contentSetting!.value);
      });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      return;
    }
    const input: SetContentSettingIn = {
      name: this.name,
      value: this.form.get('value')!.value
    };
    this.loading = true;
    this.setContentSettingGQL.mutate({ input }).
      pipe(
        finalize(() => {
          this.loading = false;
        })
      ).
      subscribe(
        _res => {
          this.notificationService.updateSuccess();
          this.form.markAsPristine();
        });
  }

}

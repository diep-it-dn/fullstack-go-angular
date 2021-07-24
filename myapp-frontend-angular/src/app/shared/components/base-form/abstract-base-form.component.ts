import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { IFormGroup, RxFormBuilder } from '@rxweb/reactive-form-validators';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { constants } from '../../common/constants';
import { NotificationService } from '../../services/notification.service';
import { BaseForm, FormType } from './base-form.model';

@Component({
  template: ''
})
export abstract class AbstractBaseFormComponent<T, R> implements OnInit {

  baseForm = new BaseForm();

  constructor(
    protected formBuilder: RxFormBuilder,
    protected notificationService: NotificationService,
  ) { }

  ngOnInit(): void {
    this.baseForm.form = this.formBuilder.formGroup(this.newT()) as IFormGroup<T>;
  }

  abstract newT(): T;

  onSubmit(): void {
    delete this.baseForm.err;
    this.baseForm.loading = true;
    this.submit().
      pipe(
        finalize(() => {
          this.baseForm.loading = false;
        })
      ).
      subscribe(
        res => {
          switch (this.baseForm.type) {
            case FormType.CREATE:
              this.notificationService.createSuccess();
              break;
            case FormType.UPDATE:
              this.notificationService.updateSuccess();
              break;
            case FormType.DELETE:
              this.notificationService.deleteSuccess();
              break;
            case FormType.REGISTER:
              this.notificationService.registerSuccess();
              break;
            default:
              break;
          }
          this.form.markAsPristine();
          this.afterSubmitOK(res);
        }, err => {
          this.handlerError(err);
        },
      );
  }

  abstract afterSubmitOK(res: R): void;

  abstract submit(): Observable<R>;

  /**
   * Override this for custom error handling.
   * 
   * @param err any
   */
  handlerError(err: any): void {
    console.log(err);
    if (err) {
      if (!!err.message) {
        if (err.message === constants.AccessDenied.code) {
          this.notificationService.error(constants.AccessDenied.msg);
        } else {
          this.baseForm.err = err.message;
        }
      }
    }
    else {
      this.notificationService.error('Error occured. The request could not be performed.');
    }
  }

  get form(): FormGroup {
    return this.baseForm.form;
  }

  get err(): string | undefined {
    return this.baseForm.err;
  }

  get loading(): boolean {
    return this.baseForm.loading;
  }

  get title(): string {
    return this.baseForm.title;
  }

  get submitName(): string {
    return this.baseForm.submitName;
  }
}

import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

const action = 'Close';
const success = 'success';
const notification = 'notification';
const error = 'error';
const panelClass = 'panelClass';


@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  config: MatSnackBarConfig = {
    duration: 5000,
    horizontalPosition: 'center',
    verticalPosition: 'top',
  }

  constructor(public snackBar: MatSnackBar) { }

  success(msg: string): void {
    this.displaySuccessMsg(msg);
  }

  createSuccess(msg = 'Created successfully.'): void {
    this.displaySuccessMsg(msg);
  }

  registerSuccess(msg = 'Registered successfully.'): void {
    this.displaySuccessMsg(msg);
  }

  updateSuccess(msg = 'Updated successfully.'): void {
    this.displaySuccessMsg(msg);
  }

  deleteSuccess(msg = 'Deleted successfully.'): void {
    this.displaySuccessMsg(msg);
  }

  error(msg = 'Hmm.. Error occured!'): void {
    this.displayErrorMsg(msg);
  }

  createError(msg = 'Hmm... Error occured! Could not create.'): void {
    this.displayErrorMsg(msg);
  }

  registerError(msg = 'Hmm... Error occured! Could not register.'): void {
    this.displayErrorMsg(msg);
  }

  updateError(msg = 'Hmm... Error occured! Could not update.'): void {
    this.displayErrorMsg(msg);
  }

  deleteError(msg = 'Hmm... Error occured! Could not delete.'): void {
    this.displayErrorMsg(msg);
  }

  private displaySuccessMsg(msg: string): void {
    this.config[panelClass] = [success, notification];
    this.snackBar.open(msg, action, this.config);
  }

  private displayErrorMsg(msg: string): void {
    this.config[panelClass] = [error, notification];
    this.snackBar.open(msg, action, this.config);
  }
}

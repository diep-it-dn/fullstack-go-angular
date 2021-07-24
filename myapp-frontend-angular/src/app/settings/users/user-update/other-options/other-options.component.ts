import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SetEmailDialogComponent } from './set-email-dialog/set-email-dialog.component';
import { SetPasswordDialogComponent } from './set-password-dialog/set-password-dialog.component';

@Component({
  selector: 'app-other-options',
  templateUrl: './other-options.component.html',
  styleUrls: ['./other-options.component.scss']
})
export class OtherOptionsComponent {

  @Input()
  id!: string;
  @Output()
  updatedEmailOutput: EventEmitter<string> = new EventEmitter();

  constructor(public dialog: MatDialog) { }

  openSetEmailDialog(): void {
    const dialogRef = this.dialog.open(SetEmailDialogComponent, {
      data: this.id
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result?.updatedEmail) {
        this.updatedEmailOutput.emit(result.updatedEmail);
      }
      console.log('The dialog was closed');
    });
  }

  openSetPasswordDialog(): void {
    const dialogRef = this.dialog.open(SetPasswordDialogComponent, {
      data: this.id
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

}

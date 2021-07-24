import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BaseForm } from './base-form.model';

@Component({
  selector: 'app-base-form',
  templateUrl: './base-form.component.html',
  styleUrls: ['./base-form.component.scss']
})
export class BaseFormComponent implements OnInit {

  @Input()
  baseForm!: BaseForm;

  @Output()
  submited = new EventEmitter();

  processingText!: string;

  constructor() { }

  ngOnInit(): void {
    if (this.baseForm.submitName === 'Create') {
      this.processingText = 'Creating...'
    } else if (this.baseForm.submitName === 'Update') {
      this.processingText = 'Updating...'
    } else {
      this.processingText = 'Processing...'
    }
  }

  onSubmit(): void {
    this.submited.emit();
  }

}

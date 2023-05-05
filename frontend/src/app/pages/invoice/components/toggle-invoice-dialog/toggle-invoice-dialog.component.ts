import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { IInvoice, IUser } from '@interfaces';
import { cleanForm } from '@utils/form-group';

@Component({
  selector: 'app-toggle-invoice-dialog',
  templateUrl: './toggle-invoice-dialog.component.html',
  styleUrls: ['./toggle-invoice-dialog.component.scss'],
})
export class ToggleInvoiceDialogComponent implements OnInit {
  title: string = '';
  content: string = '';
  cancellationNotices: string = null;
  isCancelled: boolean = false;
  currentUser: IUser = null;
  currentInvoice: IInvoice = null;
  toggleInvoiceStatusForm: FormGroup;

  constructor(
    private dialogRef: MatDialogRef<ToggleInvoiceDialogComponent>,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.setForm();
  }

  //to do: add form for cancellationNotice and send respond back with data in order to
  // make the request in invoice.component

  closeDialog(): void {
    cleanForm(this.toggleInvoiceStatusForm);
    this.dialogRef.close(false);
  }

  confirm() {
    this.dialogRef.close({ toggleBody: this.toggleInvoiceStatusForm.value });
  }

  private setForm(): void {
    this.toggleInvoiceStatusForm = this.fb.group({
      isCancelled: [!this.currentInvoice.isCancelled, [Validators.required]],
      editedBy: [
        this.currentUser.firstName + ' ' + this.currentUser.lastName,
        [Validators.required],
      ],
      cancellationNotices: [this.cancellationNotices],
    });
  }
}

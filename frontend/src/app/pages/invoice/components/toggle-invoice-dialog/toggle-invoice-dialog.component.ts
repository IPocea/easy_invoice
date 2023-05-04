import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-toggle-invoice-dialog',
  templateUrl: './toggle-invoice-dialog.component.html',
  styleUrls: ['./toggle-invoice-dialog.component.scss'],
})
export class ToggleInvoiceDialogComponent implements OnInit {
  title: string = '';
  content: string = '';

  constructor(private dialogRef: MatDialogRef<ToggleInvoiceDialogComponent>) {}

  ngOnInit(): void {}

  //to do: add form for cancellationNotice and send respond back with data in order to
  // make the request in invoice.component

  closeDialog(): void {
    this.dialogRef.close(false);
  }

  confirm() {
    this.dialogRef.close(true);
  }
}

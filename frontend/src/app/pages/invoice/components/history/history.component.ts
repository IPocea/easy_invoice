import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { IHistoryAction, IInvoice } from '@interfaces';
import { ConfirmationDialogComponent } from '@shared/components/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit {
  currentInvoice: IInvoice = null;
  historyActions: IHistoryAction[] = [];
  constructor(private dialogRef: MatDialogRef<ConfirmationDialogComponent>) { }

  ngOnInit(): void {
  }

  closeDialog(): void {
    this.dialogRef.close(false);
  }

}

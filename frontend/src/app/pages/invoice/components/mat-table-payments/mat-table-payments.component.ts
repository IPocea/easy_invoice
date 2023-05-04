import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  SimpleChange,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { IInvoice, IPayment, IPaymentId, IUser } from '@interfaces';
import { ConfirmationDialogComponent } from '@shared/components/confirmation-dialog/confirmation-dialog.component';
import { cleanForm } from '@utils/form-group';

@Component({
  selector: 'app-mat-table-payments',
  templateUrl: './mat-table-payments.component.html',
  styleUrls: ['./mat-table-payments.component.scss'],
})
export class MatTablePaymentsComponent implements OnInit {
  @Input() currentInvoice: IInvoice;
  @Input() payments: IPayment[];
  @Input() currentUser: IUser;
  @Output() sendAddReq = new EventEmitter<IPayment>();
  @Output() sendDeleteReq = new EventEmitter<IPaymentId>();
  isAdding: boolean = false;
  addPaymentForm: FormGroup;
  dataSource = new MatTableDataSource<IPayment>();
  displayedColumns: string[] = [];
  confirmDialogRef: MatDialogRef<ConfirmationDialogComponent>;

  constructor(public dialog: MatDialog, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.setForm();
  }

  ngOnChanges(changes: SimpleChange): void {
    const data = [...this.payments];
    this.checkIfDataAndUpdate(data);
    this.dataSource.data = changes['payments'].currentValue;
    this.setForm();
    this.isAdding = false;
  }

  sendPayments(): void {
    this.isAdding = true;
    cleanForm(this.addPaymentForm);
    this.sendAddReq.emit(this.addPaymentForm.value);
  }

  deletePayment(paymentId: string): void {
    this.isAdding = true;
    this.confirmDialogRef = this.dialog.open(ConfirmationDialogComponent, {
      disableClose: true,
    });
    this.confirmDialogRef.componentInstance.title = 'Sterge Plata';
    this.confirmDialogRef.componentInstance.content =
      'Esti sigur ca doresti sa stergi aceasta plata?';
    this.confirmDialogRef.afterClosed().subscribe((res) => {
      if (res) {
        this.sendDeleteReq.emit({
          paymentId: paymentId,
          invoiceId: this.currentInvoice._id,
        });
      } else {
        this.isAdding = false;
      }
    });
  }

  handleProductInputs(): void {
    this.isAdding = true;
    this.handleDecimals();
    this.isAdding = false;
  }

  private handleDecimals(): void {
    const value = this.addPaymentForm.controls['paymentAmount'].value;
    if (!value) return;
    let stringifyNum = value.toString();
    if (
      stringifyNum.includes('.') &&
      stringifyNum.indexOf('.') === stringifyNum.lastIndexOf('.')
    ) {
      const newValue: number = +stringifyNum.slice(
        0,
        stringifyNum.indexOf('.') + 3
      );
      this.addPaymentForm.controls['paymentAmount'].setValue(newValue);
    } else if (
      stringifyNum.includes('.') &&
      stringifyNum.indexOf('.') !== stringifyNum.lastIndexOf('.')
    ) {
      const newValue = +stringifyNum
        .replace('.', '!')
        .replace(/./g, '')
        .replace('!', '.');
      this.addPaymentForm.controls['paymentAmount'].setValue(newValue);
    } else {
      return;
    }
  }

  private checkIfDataAndUpdate(payments: IPayment[]): void {
    if (payments.length) {
      const dataKeys = Object.keys(payments[0]);
      for (const key of ['_id', 'updatedAt', 'invoiceId', 'editedBy']) {
        if (dataKeys.indexOf(key) === -1) {
          continue;
        } else {
          dataKeys.splice(dataKeys.indexOf(key), 1);
        }
      }
      if (this.currentUser.role.toLowerCase() === 'admin') {
        dataKeys.push('_id');
      }
      this.displayedColumns = dataKeys;
    } else {
      this.displayedColumns = ['Nicio plata in acest moment'];
    }
  }

  private setForm(): void {
    this.addPaymentForm = this.fb.group({
      paymentAmount: [this.currentInvoice.totalCost, [Validators.required]],
      invoiceId: [this.currentInvoice._id, [Validators.required]],
      addedBy: [
        this.currentUser.firstName + ' ' + this.currentUser.lastName,
        [Validators.required],
      ],
      editedBy: [null],
    });
    const data = [...this.payments];
    this.checkIfDataAndUpdate(data);
  }
}

import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { IInvoice, IPayment, IUser } from '@interfaces';
import { InvoiceService, NotificationService, PaymentService } from '@services';
import { finalize, take } from 'rxjs';

@Component({
  selector: 'app-payments',
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.scss'],
})
export class PaymentsComponent implements OnInit {
  invoiceId: string = '';
  currentUser: IUser = null;
  currentInvoice: IInvoice = null;
  payments: IPayment[] = [];
  isLoading: boolean = true;
  isAdding: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<PaymentsComponent>,
    private invoiceService: InvoiceService,
    private notificationService: NotificationService,
    private paymentService: PaymentService
  ) {}

  ngOnInit(): void {
    this.getInvoice();
  }

  closeDialog(): void {
    this.dialogRef.close({ event: 'Close Payments' });
  }

  addPayment(Ev: IPayment): void {
    this.createPayment(Ev);
  }

  private createPayment(paymentBody: IPayment): void {
    this.isAdding = true;
    this.paymentService
      .addPayment(this.currentInvoice._id, paymentBody)
      .pipe(
        take(1),
        finalize(() => {
          this.isAdding = false;
        })
      )
      .subscribe({
        next: (payments) => {
          this.payments = payments;
          this.notificationService.info('Plata a fost adaugata cu succes');
        },
        error: (err) => {
          this.notificationService.error(err.error.message);
        },
      });
  }

  private getInvoice(): void {
    this.invoiceService
      .getOne(this.invoiceId)
      .pipe(
        take(1),
        finalize(() => {
          this.getPayments();
        })
      )
      .subscribe({
        next: (invoice) => {
          this.currentInvoice = invoice;
        },
        error: (err) => {
          this.notificationService.error(err.error.message);
          this.closeDialog();
          this.isLoading = false;
        },
      });
  }

  private getPayments(): void {
    this.paymentService
      .getAllOfInvoice(this.currentInvoice._id)
      .pipe(
        take(1),
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe({
        next: (payments) => {
          this.payments = payments;
        },
        error: (err) => {
          this.notificationService.error(err.error.message);
        },
      });
  }
}

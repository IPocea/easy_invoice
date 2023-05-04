import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IPayment, IPaymentId } from '@interfaces';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  constructor(private http: HttpClient) {}

  getAllOfInvoice(invoiceId: string): Observable<IPayment[]> {
    return this.http.get<IPayment[]>(
      environment.baseUrl + `payments/${invoiceId}`
    );
  }

  addPayment(paymentBody: IPayment): Observable<IPayment[]> {
    return this.http.post<IPayment[]>(
      environment.baseUrl + `payments/add`,
      paymentBody
    );
  }

  deletePayment(paymentId: IPaymentId): Observable<IPayment[]> {
    return this.http.delete<IPayment[]>(
      environment.baseUrl +
        `payments/${paymentId.paymentId}/${paymentId.invoiceId}/delete-payment`
    );
  }
}

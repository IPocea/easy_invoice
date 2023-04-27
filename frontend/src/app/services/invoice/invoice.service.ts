import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IInvoice, ICreateInvoice } from '@interfaces';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class InvoiceService {
  constructor(private http: HttpClient) {}

  getOne(invoiceId: string): Observable<IInvoice> {
    return this.http.get<IInvoice>(
      environment.baseUrl + `invoices/${invoiceId}`
    );
  }

  create(createInvoiceBody: ICreateInvoice): Observable<IInvoice> {
    return this.http.post<IInvoice>(
      environment.baseUrl + 'invoices/add',
      createInvoiceBody
    );
  }

  update(
    updateInvoiceBody: ICreateInvoice,
    invoiceId: string
  ): Observable<IInvoice> {
    return this.http.patch<IInvoice>(
      environment.baseUrl + `invoices/${invoiceId}/edit-full-invoice`,
      updateInvoiceBody
    );
  }
}

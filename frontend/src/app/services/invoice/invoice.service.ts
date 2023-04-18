import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IInvoice } from 'interfaces/invoice.interface';
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
}

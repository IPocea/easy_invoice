import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  IInvoice,
  ICreateInvoice,
  IToggleInvoiceStatus,
  IEditDeleteResponse,
  IInvoicePagination,
  ITableFilters,
} from '@interfaces';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { setFullAvailableFilters } from '@utils/mat-table';

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

  getAll(filters: ITableFilters): Observable<IInvoicePagination> {
    const filtersString = filters ? setFullAvailableFilters(filters) : '';
    return this.http.get<IInvoicePagination>(
      environment.baseUrl + `invoices${filtersString}`
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

  getInvoiceAsPdf(invoiceId: string): Observable<any> {
    return this.http.get<any>(
      environment.baseUrl + `invoices/${invoiceId}/generate-pdf`,
      { responseType: 'blob' as 'json' }
    );
  }

  toggleStatus(
    invoiceId: string,
    toggleBody: IToggleInvoiceStatus
  ): Observable<IInvoice> {
    return this.http.patch<IInvoice>(
      environment.baseUrl + `invoices/${invoiceId}/toggle-status`,
      toggleBody
    );
  }

  deleteFromInvoice(invoiceId: string): Observable<IEditDeleteResponse> {
    return this.http.delete<IEditDeleteResponse>(
      environment.baseUrl + `invoices/${invoiceId}/delete-from-invoice`
    );
  }

  deleteFromTable(
    invoiceId: string,
    filters: ITableFilters
  ): Observable<IInvoicePagination> {
    const filtersString = filters ? setFullAvailableFilters(filters) : '';
    return this.http.delete<IInvoicePagination>(
      environment.baseUrl +
        `invoices/${invoiceId}/delete-from-table${filtersString}`
    );
  }
}

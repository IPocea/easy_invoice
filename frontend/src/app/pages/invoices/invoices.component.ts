import { Component, OnInit } from '@angular/core';
import { IInvoicePagination, ITableFilters } from '@interfaces';
import { InvoiceService, StorageService } from '@services';
import { finalize, take } from 'rxjs';

@Component({
  selector: 'app-invoices',
  templateUrl: './invoices.component.html',
  styleUrls: ['./invoices.component.scss'],
})
export class InvoicesComponent implements OnInit {
  isLoading: boolean = true;
  invoicesPagination: IInvoicePagination = null;
  defaultFilters: ITableFilters = {
    pageIndex: '0',
    pageSize: '10',
  };
  constructor(
    private invoiceService: InvoiceService,
    private storageService: StorageService
  ) {}

  ngOnInit(): void {
    const defaultPageSize = this.storageService.getItem('pageSize')
      ? (this.storageService.getItem('pageSize') as string)
      : '10';
    this.defaultFilters.pageSize = defaultPageSize;
    this.getInvoices(this.defaultFilters);
  }

  requestInvoices(ev: ITableFilters): void {
    this.getInvoices(ev);
  }

  private getInvoices(ev: ITableFilters): void {
    this.invoiceService
      .getAll(ev)
      .pipe(
        take(1),
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe({
        next: (invoicePagination) => {
          this.invoicesPagination = invoicePagination;
        },
        error: (err) => {},
      });
  }
}

import { Component, OnInit } from '@angular/core';
import { IContractPagination, ITableFilters } from '@interfaces';
import { ContractService, StorageService } from '@services';
import { finalize, take } from 'rxjs';

@Component({
  selector: 'app-contracts',
  templateUrl: './contracts.component.html',
  styleUrls: ['./contracts.component.scss'],
})
export class ContractsComponent implements OnInit {
  isLoading: boolean = true;
  contractsPagination: IContractPagination = null;
  defaultFilters: ITableFilters = {
    pageIndex: '0',
    pageSize: '10',
  };
  constructor(
    private contractService: ContractService,
    private storageService: StorageService
  ) {}

  ngOnInit(): void {
    const defaultPageSize = this.storageService.getItem('pageSize')
      ? (this.storageService.getItem('pageSize') as string)
      : '10';
    this.defaultFilters.pageSize = defaultPageSize;
    this.getInvoices(this.defaultFilters);
  }

  requestContracts(ev: ITableFilters): void {
    this.getInvoices(ev);
  }

  private getInvoices(ev: ITableFilters): void {
    this.contractService
      .getAll(ev)
      .pipe(
        take(1),
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe({
        next: (invoicePagination) => {
          this.contractsPagination = invoicePagination;
        },
        error: (err) => {},
      });
  }
}

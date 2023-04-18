import { Component, OnInit } from '@angular/core';
import { ICompanyPagination, ITableFilters } from '@interfaces';
import { CompaniesService, StorageService } from '@services';
import { take } from 'rxjs';

@Component({
  selector: 'app-companies',
  templateUrl: './companies.component.html',
  styleUrls: ['./companies.component.scss'],
})
export class CompaniesComponent implements OnInit {
  isLoading: boolean = false;
  isEditingOrDeleting: boolean = false;
  companiesPagination: ICompanyPagination = null;
  defaultFilters: ITableFilters = {
    pageIndex: '0',
    pageSize: '10',
  };
  constructor(
    private companiesService: CompaniesService,
    private storageService: StorageService
  ) {}

  ngOnInit(): void {
    const defaultPageSize = this.storageService.getItem('pageSize')
      ? this.storageService.getItem('pageSize') as string
      : '10';
    this.defaultFilters.pageSize = defaultPageSize;
    this.getCompanies(this.defaultFilters);
  }

  private getCompanies(filters: ITableFilters): void {
    this.companiesService
      .getAllCompanies(filters)
      .pipe(take(1))
      .subscribe({
        next: (companiesPagination) => {
          this.companiesPagination = companiesPagination;
        },
        error: (err) => {},
      });
  }

  requestCompanies(ev: ITableFilters): void {
    this.getCompanies(ev);
  }
}

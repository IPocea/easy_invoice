import { Component, OnInit } from '@angular/core';
import { IIndividualPagination, ITableFilters } from '@interfaces';
import { IndividualsService, StorageService } from '@services';
import { take } from 'rxjs';

@Component({
  selector: 'app-individuals',
  templateUrl: './individuals.component.html',
  styleUrls: ['./individuals.component.scss'],
})
export class IndividualsComponent implements OnInit {
  isLoading: boolean = false;
  individualsPagination: IIndividualPagination = null;
  defaultFilters: ITableFilters = {
    pageIndex: '0',
    pageSize: '10',
  };

  constructor(
    private individualsService: IndividualsService,
    private storageService: StorageService
  ) {}

  ngOnInit(): void {
    const defaultPageSize = this.storageService.getItem('pageSize')
      ? this.storageService.getItem('pageSize') as string
      : '10';
    this.defaultFilters.pageSize = defaultPageSize;
    this.getIndividuals(this.defaultFilters);
  }

  private getIndividuals(filters: ITableFilters): void {
    this.individualsService
      .getAllIndividuals(filters)
      .pipe(take(1))
      .subscribe({
        next: (individualsPagination) => {
          this.individualsPagination = individualsPagination;
        },
        error: (err) => {},
      });
  }

  requestIndividuals(ev: ITableFilters): void {
    this.getIndividuals(ev);
  }
}

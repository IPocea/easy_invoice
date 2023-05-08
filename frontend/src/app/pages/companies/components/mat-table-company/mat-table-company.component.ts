import { BooleanInput } from '@angular/cdk/coercion';
import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  SimpleChange,
  ViewChild,
} from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import {
  ICompany,
  ICompanyPagination,
  ITableFilters,
  IUser,
} from '@interfaces';
import {
  CompaniesService,
  LoginDataService,
  NotificationService,
  StorageService,
} from '@services';
import { ConfirmationDialogComponent } from '@shared/components/confirmation-dialog/confirmation-dialog.component';
import { finalize, take } from 'rxjs';
import { environment } from '../../../../../environments/environment';

import { AddEditCompanyComponent } from '../add-edit-company/add-edit-company.component';
import { ViewCompanyComponent } from '../view-company/view-company.component';

@Component({
  selector: 'app-mat-table-company',
  templateUrl: './mat-table-company.component.html',
  styleUrls: ['./mat-table-company.component.scss'],
})
export class MatTableCompanyComponent implements OnInit {
  @Input() companiesPagination: ICompanyPagination;
  @Output() sendFilters = new EventEmitter<ITableFilters>();
  @ViewChild(MatSort) sort: MatSort;
  isLoading: boolean = false;
  length: number;
  pageIndex: number;
  pageSize: number;
  pageSizeOptions: number[] = [];
  showFirstLastButtons: BooleanInput = true;
  searchValue: string = '';
  typingTimer: ReturnType<typeof setTimeout>;
  typingInt: number = 350;
  dataSource = new MatTableDataSource<ICompany>();
  displayedColumns = [];
  tableDialogRef: MatDialogRef<AddEditCompanyComponent | ViewCompanyComponent>;
  confirmDialogRef: MatDialogRef<ConfirmationDialogComponent>;
  filters: ITableFilters = null;
  currentUser: IUser = null;

  constructor(
    public dialog: MatDialog,
    private notificationService: NotificationService,
    private companiesService: CompaniesService,
    private loginData: LoginDataService,
    private storageService: StorageService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.loginData.getLoggedUser();
    const data = { ...this.companiesPagination };
    this.checkIfDataAndUpdate(data);
    // Assign the data to the data source for the table to render
    this.dataSource = new MatTableDataSource<any>(
      this.companiesPagination.data
    );
    this.setPaginator(this.companiesPagination);
    // in order to sort by letter and not let Capital letters to less points on compare
    // we need on string to make all lower case
    this.dataSource.sortingDataAccessor = (
      data: any,
      sortHeaderId: string
    ): string => {
      if (typeof data[sortHeaderId] === 'string') {
        return data[sortHeaderId].toLocaleLowerCase();
      }
      return data[sortHeaderId];
    };
  }

  ngOnChanges(changes: SimpleChange): void {
    const data = { ...this.companiesPagination };
    this.checkIfDataAndUpdate(data);
    this.setPaginator(this.companiesPagination);
    this.dataSource.data = changes['companiesPagination'].currentValue.data;
    this.isLoading = false;
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  applySearchFilter(): void {
    this.clearTimeout();
    this.typingTimer = setTimeout(
      this.searchByValue.bind(this),
      this.typingInt
    );
  }

  clearTimeout(): void {
    clearTimeout(this.typingTimer);
  }

  clearSearchValue(): void {
    this.searchValue = '';
    this.searchByValue();
  }

  deleteCompany(companyId: string): void {
    this.isLoading = true;
    this.confirmAndDelete(companyId);
  }

  handlePageChange(ev: any): void {
    this.storageService.setItem('pageSize', ev.pageSize);
    this.resetFiltersObj();
    this.filters = {
      pageIndex: ev.pageIndex.toString(),
      pageSize: ev.pageSize.toString(),
    };
    if (this.sort.active || this.sort.direction !== '') {
      this.filters.sortBy = this.sort.active;
      this.filters.sortDirection = this.sort.direction;
    }
    if (this.searchValue.trim()) {
      this.filters.searchValue = this.searchValue.trim();
    }
    this.requestFilteredData(this.filters);
  }

  sortData(sort: Sort) {
    this.resetFiltersObj();
    this.filters = {
      pageIndex: '0',
      pageSize: this.pageSize.toString(),
    };
    if (sort.active || sort.direction !== '') {
      this.filters.sortBy = sort.active;
      this.filters.sortDirection = sort.direction;
    }
    if (this.searchValue.trim()) {
      this.filters.searchValue = this.searchValue.trim();
    }
    this.requestFilteredData(this.filters);
  }

  toggleCompanyStatus(company: ICompany): void {
    this.isLoading = true;
    this.toogleStatus(company);
  }

  requestFilteredData(fitlers: ITableFilters): void {
    this.isLoading = true;
    this.sendFilters.emit(fitlers);
  }

  openTableForm(actionType: string, company?: ICompany) {
    switch (actionType) {
      case 'view-company':
        this.tableDialogRef = this.dialog.open(ViewCompanyComponent, {
          disableClose: true,
        });
        this.tableDialogRef.componentInstance.company = company;
        this.tableDialogRef.afterClosed().subscribe((res) => {});
        break;
      case 'add-company':
        this.tableDialogRef = this.dialog.open(AddEditCompanyComponent, {
          disableClose: true,
        });
        this.tableDialogRef.componentInstance.filters = this.filters;
        this.tableDialogRef.afterClosed().subscribe((res) => {
          if (res.event === 'Add Company') {
            this.checkIfDataAndUpdate(res.companyData);
            this.setPaginator(res.companyData);
            this.resetSort();
            this.resetFiltersObj();
            this.filters = {
              pageIndex: '0',
              pageSize: this.pageSize.toString(),
            };
            this.dataSource.data = res.companyData.data;
            this.notificationService.info('Compania a fost adaugata');
          }
        });
        break;
      case 'edit-company':
        this.tableDialogRef = this.dialog.open(AddEditCompanyComponent, {
          disableClose: true,
        });
        this.tableDialogRef.componentInstance.filters = this.filters;
        this.tableDialogRef.componentInstance.company = company;
        this.tableDialogRef.afterClosed().subscribe((res) => {
          if (res?.event === 'Edit Company') {
            this.checkIfDataAndUpdate(res.companyData);
            this.setPaginator(res.companyData);
            this.dataSource.data = res.companyData.data;
            this.notificationService.info(
              'Compania a fost modificata cu succes'
            );
          }
        });
        break;
      default:
        break;
    }
  }

  private confirmAndDelete(companyId: string): void {
    this.confirmDialogRef = this.dialog.open(ConfirmationDialogComponent, {
      disableClose: true,
    });
    this.confirmDialogRef.componentInstance.title = 'Sterge compania';
    this.confirmDialogRef.componentInstance.content =
      'Esti sigur ca doresti sa stergi aceasta companie? In schimb o poti dezactiva din tabel';
    this.confirmDialogRef.afterClosed().subscribe((res) => {
      if (res) {
        this.removeItem(companyId);
      } else {
        this.isLoading = false;
      }
    });
  }

  private checkIfDataAndUpdate(companiesPagination: ICompanyPagination): void {
    if (companiesPagination?.data.length) {
      const dataKeys = Object.keys(companiesPagination.data[0]);
      for (const key of [
        '_id',
        'J',
        'headquarters',
        'vatRate',
        'bankAccount',
        'bank',
        'totalSum',
        'totalPayment',
        'createdAt',
        'updatedAt',
        'addedBy',
        'editedBy',
      ]) {
        if (dataKeys.indexOf(key) === -1) {
          continue;
        } else {
          dataKeys.splice(dataKeys.indexOf(key), 1);
        }
      }
      dataKeys.push('totalSum');
      dataKeys.push('totalPayment');
      dataKeys.push('_id');
      this.displayedColumns = dataKeys;
    } else {
      this.displayedColumns = ['Nicio companie identificata'];
    }
  }

  private paginateAfterUpdate(
    companiesData: ICompanyPagination,
    message: string
  ): void {
    this.checkIfDataAndUpdate(companiesData);
    this.setPaginator(companiesData);
    this.dataSource.data = companiesData.data;
    this.notificationService.info(message);
  }

  private searchByValue(): void {
    this.resetSort();
    this.resetFiltersObj();
    this.filters = {
      pageIndex: '0',
      pageSize: this.pageSize.toString(),
    };
    if (this.searchValue.trim()) {
      this.filters.searchValue = this.searchValue.trim();
    }
    this.requestFilteredData(this.filters);
  }

  private setPaginator(companiesPagination: ICompanyPagination): void {
    this.pageIndex = companiesPagination.pageIndex;
    this.pageSize = companiesPagination.pageSize;
    this.length = companiesPagination.totalItems;
    this.pageSizeOptions = environment.pageSizeOptions;
  }

  private resetSort(): void {
    if (this.sort) {
      this.sort.active = '';
      this.sort.direction = '';
      this.sort._stateChanges.next();
      this.dataSource.sort = this.sort;
    }
  }

  private resetFiltersObj(): void {
    this.filters = null;
  }

  private removeItem(companyId: string): void {
    this.companiesService
      .deleteCompany(companyId, this.filters)
      .pipe(
        take(1),
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe({
        next: (companyData) => {
          this.paginateAfterUpdate(companyData, 'Societatea a fost stearsa');
        },
        error: (err) => {
          this.notificationService.error(err.error.message);
        },
      });
  }

  private toogleStatus(company: ICompany): void {
    this.companiesService
      .toggleStatus(company._id, !company.isActivated, this.filters)
      .pipe(
        take(1),
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe({
        next: (companiesData) => {
          this.paginateAfterUpdate(companiesData, 'Statusul a fost actualizat');
        },
        error: (err) => {
          this.notificationService.error(
            'A intervenit o eroare. Te rugam sa dai refresh la pagina si sa incerci din nou'
          );
        },
      });
  }
}

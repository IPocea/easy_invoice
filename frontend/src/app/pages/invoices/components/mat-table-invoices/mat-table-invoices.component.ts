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
  IInvoice,
  IInvoicePagination,
  ITableFilters,
  IUser,
} from '@interfaces';
import {
  InvoiceService,
  LoginDataService,
  NotificationService,
  StorageService,
} from '@services';
import { ConfirmationDialogComponent } from '@shared/components/confirmation-dialog/confirmation-dialog.component';
import { environment } from '../../../../../environments/environment';
import { finalize, take } from 'rxjs';

@Component({
  selector: 'app-mat-table-invoices',
  templateUrl: './mat-table-invoices.component.html',
  styleUrls: ['./mat-table-invoices.component.scss'],
})
export class MatTableInvoicesComponent implements OnInit {
  @Input() invoicesPagination: IInvoicePagination;
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
  dataSource = new MatTableDataSource<IInvoice>();
  displayedColumns = [];
  confirmDialogRef: MatDialogRef<ConfirmationDialogComponent>;
  filters: ITableFilters = null;
  currentUser: IUser = null;

  constructor(
    public dialog: MatDialog,
    private notificationService: NotificationService,
    private invoiceService: InvoiceService,
    private loginData: LoginDataService,
    private storageService: StorageService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.loginData.getLoggedUser();
    const data = { ...this.invoicesPagination };
    this.checkIfDataAndUpdate(data);
    // Assign the data to the data source for the table to render
    this.dataSource = new MatTableDataSource<any>(this.invoicesPagination.data);
    this.setPaginator(this.invoicesPagination);
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
    const data = { ...this.invoicesPagination };
    this.checkIfDataAndUpdate(data);
    this.setPaginator(this.invoicesPagination);
    this.dataSource.data = changes['invoicesPagination'].currentValue.data;
    this.isLoading = false;
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  getEventValue($event: any): string {
    return ($event.target as HTMLInputElement).value;
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

  deleteInvoice(invoiceId: string): void {
    this.isLoading = true;
    this.confirmAndDelete(invoiceId);
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

  requestFilteredData(fitlers: ITableFilters): void {
    this.isLoading = true;
    this.sendFilters.emit(fitlers);
  }

  private confirmAndDelete(invoiceId: string): void {
    this.confirmDialogRef = this.dialog.open(ConfirmationDialogComponent, {
      disableClose: true,
    });
    this.confirmDialogRef.componentInstance.title = 'Sterge Factura';
    this.confirmDialogRef.componentInstance.content =
      'Esti sigur ca doresti sa stergi aceasta factura? Toate informatiile despre aceasta factura vor fi sterse (de ex. Contract, Istoric, Plati, etc.)';
    this.confirmDialogRef.afterClosed().subscribe((res) => {
      if (res) {
        this.removeItem(invoiceId);
      } else {
        this.isLoading = false;
      }
    });
  }

  // to do, change backend code so the returned code will be only fields you need

  private checkIfDataAndUpdate(invoicesPagination: IInvoicePagination): void {
    if (invoicesPagination?.data.length) {
      const dataKeys = Object.keys(invoicesPagination.data[0]);
      for (const key of [
        '_id',
        'series',
        'date',
        'numberOfAccompanyingNotice',
        'cancellationNotices',
        'borderColor',
        'companyId',
        'individualId',
        'company',
        'individual',
        'buyer',
        'seller',
        'products',
        'payments',
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
    invoicesData: IInvoicePagination,
    message: string
  ): void {
    this.checkIfDataAndUpdate(invoicesData);
    this.setPaginator(invoicesData);
    this.dataSource.data = invoicesData.data;
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

  private setPaginator(invoicesPagination: IInvoicePagination): void {
    this.pageIndex = invoicesPagination.pageIndex;
    this.pageSize = invoicesPagination.pageSize;
    this.length = invoicesPagination.totalItems;
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

  private removeItem(invoiceId: string): void {
    this.invoiceService
      .deleteFromTable(invoiceId, this.filters)
      .pipe(
        take(1),
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe({
        next: (invoiceData) => {
          this.paginateAfterUpdate(invoiceData, 'Factura a fost stearsa');
        },
        error: (err) => {
          this.notificationService.error(err.error.message);
        },
      });
  }
}

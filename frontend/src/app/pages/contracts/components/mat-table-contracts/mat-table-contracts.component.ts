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
import { Router } from '@angular/router';
import {
  IContract,
  IContractPagination,
  ITableFilters,
  ITokens,
  IUser,
} from '@interfaces';
import {
  ContractService,
  LoginDataService,
  NotificationService,
  StorageService,
  TokenService,
} from '@services';
import { ConfirmationDialogComponent } from '@shared/components/confirmation-dialog/confirmation-dialog.component';
import { environment } from '../../../../../environments/environment';
import { finalize, take } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-mat-table-contracts',
  templateUrl: './mat-table-contracts.component.html',
  styleUrls: ['./mat-table-contracts.component.scss'],
})
export class MatTableContractsComponent implements OnInit {
  @Input() contractsPagination: IContractPagination;
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
  dataSource = new MatTableDataSource<IContract>();
  displayedColumns = [];
  confirmDialogRef: MatDialogRef<ConfirmationDialogComponent>;
  filters: ITableFilters = null;
  currentUser: IUser = null;

  constructor(
    public dialog: MatDialog,
    private notificationService: NotificationService,
    private contractService: ContractService,
    private loginData: LoginDataService,
    private storageService: StorageService,
    private tokenService: TokenService,
    private loginDataService: LoginDataService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentUser = this.loginData.getLoggedUser();
    const data = { ...this.contractsPagination };
    this.checkIfDataAndUpdate(data);
    this.dataSource = new MatTableDataSource<any>(
      this.contractsPagination.data
    );
    this.setPaginator(this.contractsPagination);
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
    const data = { ...this.contractsPagination };
    this.checkIfDataAndUpdate(data);
    this.setPaginator(this.contractsPagination);
    this.dataSource.data = changes['contractsPagination'].currentValue.data;
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

  viewContract(contractId: string): void {
    this.isLoading = true;
    this.refreshToken(contractId);
  }

  private checkIfDataAndUpdate(contractsPagination: IContractPagination): void {
    if (contractsPagination?.data.length) {
      this.displayedColumns = [
        'date',
        'buyer',
        'number',
        'totalCost',
        'addedBy',
        'createdAt',
        '_id',
      ];
    } else {
      this.displayedColumns = ['Niciun contract identificat'];
    }
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

  private setPaginator(contractsPagination: IContractPagination): void {
    this.pageIndex = contractsPagination.pageIndex;
    this.pageSize = contractsPagination.pageSize;
    this.length = contractsPagination.totalItems;
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

  private refreshToken(contractId: string): void {
    const tokens: ITokens = this.storageService.getItem('tokens') as ITokens;
    this.tokenService
      .useRefreshToken(tokens.refreshToken)
      .pipe(take(1))
      .subscribe({
        next: (tokens) => {
          this.storageService.setItem('tokens', tokens);
          this.generateContractPdf(contractId);
        },
        error: (err) => {
          if (
            err instanceof HttpErrorResponse &&
            err.status === 498 &&
            (err.error.error === 'Tokenul refresh a expirat' ||
              err.error.error === 'Acces interzis')
          ) {
            this.storageService.removeItem('tokens');
            this.loginDataService.setNextLoggedUser(null);
            this.router.navigate(['/login']);
            this.notificationService.error(
              err.error.error + '. Te rugam sa te loghezi'
            );
          }
          this.isLoading = false;
        },
      });
  }

  private generateContractPdf(contractId: string): void {
    this.contractService
      .getContractAsPdf(contractId)
      .pipe(
        take(1),
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe({
        next: (data: Blob) => {
          const file = new Blob([data], { type: 'application/pdf' });
          const fileURL = URL.createObjectURL(file);
          window.open(fileURL, '_blank');
        },
        error: (err) => {},
      });
  }
}

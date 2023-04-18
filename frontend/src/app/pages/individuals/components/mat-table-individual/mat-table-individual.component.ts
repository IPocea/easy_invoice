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
  IIndividual,
  IIndividualPagination,
  ITableFilters,
  IUser,
} from '@interfaces';
import {
  IndividualsService,
  LoginDataService,
  NotificationService,
  StorageService,
} from '@services';
import { ConfirmationDialogComponent } from '@shared/components/confirmation-dialog/confirmation-dialog.component';
import { finalize, take } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { AddEditIndividualComponent } from '../add-edit-individual/add-edit-individual.component';
import { ViewIndividualComponent } from '../view-individual/view-individual.component';

@Component({
  selector: 'app-mat-table-individual',
  templateUrl: './mat-table-individual.component.html',
  styleUrls: ['./mat-table-individual.component.scss'],
})
export class MatTableIndividualComponent implements OnInit {
  @Input() individualsPagination: IIndividualPagination;
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
  dataSource = new MatTableDataSource<IIndividual>();
  displayedColumns = [];
  tableDialogRef: MatDialogRef<
    AddEditIndividualComponent | ViewIndividualComponent
  >;
  confirmDialogRef: MatDialogRef<ConfirmationDialogComponent>;
  filters: ITableFilters = null;
  currentUser: IUser = null;

  constructor(
    public dialog: MatDialog,
    private notificationService: NotificationService,
    private individualsService: IndividualsService,
    private loginData: LoginDataService,
    private storageService: StorageService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.loginData.getLoggedUser();
    const data = { ...this.individualsPagination };
    this.checkIfDataAndUpdate(data);
    // Assign the data to the data source for the table to render
    this.dataSource = new MatTableDataSource<any>(
      this.individualsPagination.data
    );
    this.setPaginator(this.individualsPagination);
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
    const data = { ...this.individualsPagination };
    this.checkIfDataAndUpdate(data);
    this.setPaginator(this.individualsPagination);
    this.dataSource.data = changes['individualsPagination'].currentValue.data;
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

  deleteIndividual(individualId: string): void {
    this.isLoading = true;
    this.confirmAndDelete(individualId);
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

  toggleIndividualStatus(individual: any): void {
    this.isLoading = true;
    this.toogleStatus(individual);
  }

  requestFilteredData(fitlers: ITableFilters): void {
    this.isLoading = true;
    this.sendFilters.emit(fitlers);
  }

  openTableForm(actionType: string, individual?: any) {
    switch (actionType) {
      case 'view-individual':
        this.tableDialogRef = this.dialog.open(ViewIndividualComponent, {
          disableClose: true,
        });
        this.tableDialogRef.componentInstance.individual = individual;
        this.tableDialogRef.afterClosed().subscribe((res) => {});
        break;
      case 'add-individual':
        this.tableDialogRef = this.dialog.open(AddEditIndividualComponent, {
          disableClose: true,
        });
        this.tableDialogRef.componentInstance.filters = this.filters;
        this.tableDialogRef.afterClosed().subscribe((res) => {
          if (res.event === 'Add Individual') {
            this.checkIfDataAndUpdate(res.individualData);
            this.setPaginator(res.individualData);
            this.resetSort();
            this.resetFiltersObj();
            this.filters = {
              pageIndex: '0',
              pageSize: this.pageSize.toString(),
            };
            this.dataSource.data = res.individualData.data;
            this.notificationService.info('Persoana fizica a fost adaugata');
          }
        });
        break;
      case 'edit-individual':
        this.tableDialogRef = this.dialog.open(AddEditIndividualComponent, {
          disableClose: true,
        });
        this.tableDialogRef.componentInstance.filters = this.filters;
        this.tableDialogRef.componentInstance.individual = individual;
        this.tableDialogRef.afterClosed().subscribe((res) => {
          if (res?.event === 'Edit Individual') {
            this.checkIfDataAndUpdate(res.individualData);
            this.setPaginator(res.individualData);
            this.dataSource.data = res.individualData.data;
            this.notificationService.info(
              'Persoana fizica a fost modificata cu succes'
            );
          }
        });
        break;
      default:
        break;
    }
  }

  private confirmAndDelete(userId: string): void {
    this.confirmDialogRef = this.dialog.open(ConfirmationDialogComponent, {
      disableClose: true,
    });
    this.confirmDialogRef.componentInstance.title = 'Sterge persoana fizica';
    this.confirmDialogRef.componentInstance.content =
      'Esti sigur ca doresti sa stergi aceasta persoana fizica? In schimb o poti dezactiva din tabel';
    this.confirmDialogRef.afterClosed().subscribe((res) => {
      if (res) {
        this.removeItem(userId);
      } else {
        this.isLoading = false;
      }
    });
  }

  private checkIfDataAndUpdate(individualsPagination: any): void {
    if (individualsPagination?.data.length) {
      const dataKeys = Object.keys(individualsPagination.data[0]);
      for (const key of [
        '_id',
        '__v',
        'series',
        'headquarters',
        'bankAccount',
        'bank',
        'paymentData',
        'createdAt',
        'updatedAt',
        'addedBy',
        'editedBy',
      ]) {
        dataKeys.splice(dataKeys.indexOf(key), 1);
      }
      dataKeys.push('totalSum');
      dataKeys.push('totalPayments');
      dataKeys.push('_id');
      this.displayedColumns = dataKeys;
    } else {
      this.displayedColumns = ['Nicio persoana fizica identificata'];
    }
  }

  private paginateAfterUpdate(
    individualsData: IIndividualPagination,
    message: string
  ): void {
    this.checkIfDataAndUpdate(individualsData);
    this.setPaginator(individualsData);
    this.dataSource.data = individualsData.data;
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

  private setPaginator(individualsPagination: any): void {
    this.pageIndex = individualsPagination.pageIndex;
    this.pageSize = individualsPagination.pageSize;
    this.length = individualsPagination.totalItems;
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

  private removeItem(individualId: string): void {
    this.individualsService
      .deleteIndividual(individualId, this.filters)
      .pipe(
        take(1),
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe({
        next: (individualData) => {
          this.paginateAfterUpdate(
            individualData,
            'Persoana fizica a fost stearsa'
          );
        },
        error: (err) => {
          this.notificationService.error(err.error.message);
        },
      });
  }

  private toogleStatus(individual: IIndividual): void {
    this.individualsService
      .toggleStatus(individual._id, !individual.isActivated, this.filters)
      .pipe(
        take(1),
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe({
        next: (individualsData) => {
          this.paginateAfterUpdate(
            individualsData,
            'Statusul a fost actualizat'
          );
        },
        error: (err) => {
          this.notificationService.error(
            'A intervenit o eroare. Te rugam sa dai refresh la pagina si sa incerci din nou'
          );
        },
      });
  }
}

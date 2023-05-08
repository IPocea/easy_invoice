import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  SimpleChange,
  ViewChild,
} from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort, Sort } from '@angular/material/sort';

import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { NotificationService, StorageService, UserService } from '@services';
import { finalize, take } from 'rxjs';
import { ITableFilters, IUser, IUserPagination } from '@interfaces';
import { ChangeUserPasswordComponent } from '@pages/users/components/change-user-password/change-user-password.component';
import { AddEditUserComponent } from '../add-edit-user/add-edit-user.component';
import { BooleanInput } from '@angular/cdk/coercion';
import { ConfirmationDialogComponent } from '@shared/components/confirmation-dialog/confirmation-dialog.component';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-mat-table-users',
  templateUrl: './mat-table-users.component.html',
  styleUrls: ['./mat-table-users.component.scss'],
})
export class MatTableUsersComponent implements OnInit {
  @Input() usersPagination: IUserPagination;
  @Output() sendFilters = new EventEmitter<any>();
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
  dataSource = new MatTableDataSource<IUser>();
  displayedColumns = [];
  tableDialogRef: MatDialogRef<any>;
  confirmDialogRef: MatDialogRef<ConfirmationDialogComponent>;
  currentUserId: string;
  filters: ITableFilters = null;
  constructor(
    public dialog: MatDialog,
    private notificationService: NotificationService,
    private userService: UserService,
    private storageService: StorageService
  ) {}
  ngOnInit(): void {
    // if there is data then make the table headers, if not table header = no item added
    const data = { ...this.usersPagination };
    this.checkIfDataAndUpdate(data);
    // Assign the data to the data source for the table to render
    this.dataSource = new MatTableDataSource<IUser>(this.usersPagination.data);
    this.setPaginator(this.usersPagination);
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

  // when data from parent change we need to update the table with the new data
  ngOnChanges(changes: SimpleChange): void {
    const data = { ...this.usersPagination };
    this.checkIfDataAndUpdate(data);
    this.setPaginator(this.usersPagination);
    this.dataSource.data = changes['usersPagination'].currentValue.data;
    this.isLoading = false;
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  // on keyup we clear timeout and start a timeout with our search filters
  // on keydown we clear timeout
  // when user stop typing, after 350 ms, the call is made to database
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

  deleteUser(userId: string): void {
    this.isLoading = true;
    this.confirmAndDelete(userId);
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

  toggleUserStatus(user: IUser): void {
    this.isLoading = true;
    this.toogleStatus(user);
  }

  requestFilteredData(fitlers: ITableFilters): void {
    this.isLoading = true;
    this.sendFilters.emit(fitlers);
  }

  openTableForm(actionType: string, user?: any) {
    switch (actionType) {
      case 'add-user':
        this.tableDialogRef = this.dialog.open(AddEditUserComponent, {
          disableClose: true,
        });
        this.tableDialogRef.componentInstance.filters = this.filters;
        this.tableDialogRef.afterClosed().subscribe((res) => {
          if (res.event === 'Add User') {
            this.checkIfDataAndUpdate(res.usersData);
            this.setPaginator(res.usersData);
            this.resetSort();
            this.resetFiltersObj();
            this.filters = {
              pageIndex: '0',
              pageSize: this.pageSize.toString(),
            };
            this.dataSource.data = res.usersData.data;
            this.notificationService.info('Userul a fost adaugat');
          }
        });
        break;
      case 'edit-user':
        this.tableDialogRef = this.dialog.open(AddEditUserComponent, {
          disableClose: true,
        });
        this.tableDialogRef.componentInstance.filters = this.filters;
        this.tableDialogRef.componentInstance.user = user;
        this.tableDialogRef.afterClosed().subscribe((res)=> {
          if (res?.event === 'Edit User') {
            this.checkIfDataAndUpdate(res.usersData);
            this.setPaginator(res.usersData);
            this.dataSource.data = res.usersData.data;
            this.notificationService.info('Userul a fost modificat');
          }
        })
        break;
      case 'change-password':
        this.tableDialogRef = this.dialog.open(ChangeUserPasswordComponent, {
          disableClose: true,
        });
        this.tableDialogRef.componentInstance.filters = this.filters;
        this.tableDialogRef.componentInstance.user = user;
        this.tableDialogRef.afterClosed().subscribe((res) => {
          if (res?.event === 'Change Password') {
            this.checkIfDataAndUpdate(res.usersData);
            this.setPaginator(res.usersData);
            this.dataSource.data = res.usersData.data;
            this.notificationService.info('Parola a fost modificata');
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
    this.confirmDialogRef.componentInstance.title = 'Sterge userul';
    this.confirmDialogRef.componentInstance.content =
      'Esti sigur ca doresti sa stergi acest user?';
    this.confirmDialogRef.afterClosed().subscribe((res) => {
      if (res) {
        this.removeItem(userId);
      } else {
        this.isLoading = false;
      }
    });
  }

  private checkIfDataAndUpdate(usersPagination: IUserPagination): void {
    if (usersPagination?.data[0]) {
      const dataKeys = Object.keys(usersPagination.data[0]);
      dataKeys.splice(dataKeys.indexOf('_id'), 1);
      dataKeys.splice(dataKeys.indexOf('__v'), 1);
      dataKeys.push('_id');
      this.displayedColumns = dataKeys;
    } else {
      this.displayedColumns = ['Niciun user identificat'];
    }
  }

  private paginateAfterUpdate(
    usersData: IUserPagination,
    message: string
  ): void {
    this.checkIfDataAndUpdate(usersData);
    this.setPaginator(usersData);
    this.dataSource.data = usersData.data;
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

  private setPaginator(usersPagination: IUserPagination): void {
    this.pageIndex = usersPagination.pageIndex;
    this.pageSize = usersPagination.pageSize;
    this.length = usersPagination.totalItems;
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

  private removeItem(userId: string): void {
    this.userService
      .deleteUser(userId, this.filters)
      .pipe(
        take(1),
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe({
        next: (usersData) => {
          this.paginateAfterUpdate(usersData, 'Userul a fost sters');
        },
        error: (err) => {
          this.notificationService.error(err.error.message);
        },
      });
  }

  private toogleStatus(user: IUser): void {
    this.userService
      .updateUserStatus(user._id, !user.isActivated, this.filters)
      .pipe(
        take(1),
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe({
        next: (usersData) => {
          this.paginateAfterUpdate(usersData, 'Statusul a fost actualizat');
        },
        error: (err) => {
          this.notificationService.error(
            'A intervenit o eroare. Te rugam sa dai refresh la pagina si sa incerci din nou'
          );
        },
      });
  }
}

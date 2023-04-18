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
import { NotificationService, UserService } from '@services';
import { finalize, take } from 'rxjs';
import { ITableFilters } from '@interfaces';
import { ChangeUserPasswordComponent } from '@pages/users/components/change-user-password/change-user-password.component';
@Component({
  selector: 'app-mat-table',
  templateUrl: './mat-table.component.html',
  styleUrls: ['./mat-table.component.scss'],
})
export class MatTableComponent implements OnInit {
  @Input() tableData: any;
  @Input() tableType: string;
  @Output() sendFilters = new EventEmitter<any>();
  @ViewChild(MatSort) sort: MatSort;
  isLoading: boolean = false;
  length: number;
  pageIndex: number;
  pageSize: number;
  pageSizeOptions: number[] = [];
  searchValue: string = '';
  typingTimer: ReturnType<typeof setTimeout>;
  typingInt: number = 350;
  dataSource = new MatTableDataSource<any>();
  displayedColumns = [];
  tableDialogRef: MatDialogRef<any>;
  currentUserId: string;
  filters: ITableFilters = null;
  constructor(
    public dialog: MatDialog,
    private notificationService: NotificationService,
    private userService: UserService
  ) {}
  ngOnInit(): void {
    // if there is data then make the table headers, if not table header = no item added
    const data = { ...this.tableData };
    this.checkIfDataAndUpdate(data);
    // Assign the data to the data source for the table to render
    this.dataSource = new MatTableDataSource<any>(
      this.tableData.data
    );
    this.setPaginator(this.tableData);
    // in order to sort by letter and not let Capital letters to less points on compare
    // we need on string to make all lower case
    this.dataSource.sortingDataAccessor = (data: any, sortHeaderId: string): string => {
      if (typeof data[sortHeaderId] === 'string') {
        return data[sortHeaderId].toLocaleLowerCase();
      }
      return data[sortHeaderId];
    };
    this.currentUserId = this.tableData.data._id;
    
    
  }

  // when data from parent change we need to update the table with the new data
  ngOnChanges(changes: SimpleChange): void {
    const data = { ...this.tableData };
    this.checkIfDataAndUpdate(data);
    this.setPaginator(this.tableData);
    if (this.currentUserId !== this.tableData.data.itemId) {
      this.resetSort();
      this.searchValue = '';
    }
    this.dataSource.data = changes['tableData'].currentValue.data;
    this.isLoading = false;
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  getEventValue($event: any): string {
    return ($event.target as HTMLInputElement).value;
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

  deleteItem(dataItemId: string): void {
    this.isLoading = true;
    const result = confirm('Are you sure you want to delete the item?');
    if (result) {
      this.removeItem(dataItemId);
    }
  }

  handlePageChange(ev: any): void {
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

  openTableForm(actionType: string, item?: any) {
    switch (actionType) {
      case 'edit-item':
        this.tableDialogRef = this.dialog.open(ChangeUserPasswordComponent, {
          disableClose: true,
          data: {
            filters: this.filters,
            documentId: this.tableData.data._id,
            item: item,
          },
        });
        this.tableDialogRef.afterClosed().subscribe((res) => {
          if (res?.event === 'Edit Item') {
            this.checkIfDataAndUpdate(res.newTableData);
            this.setPaginator(res.newTableData);
            this.dataSource.data = res.newTableData.dataCosts.data;
            this.notificationService.info('The item was edited');
          }
        });
        break;
      default:
        break;
    }
  }

  private checkIfDataAndUpdate(
    dataCostsData: any
  ): void {
    if (dataCostsData?.dataCosts?.data[0]) {
      const dataKeys = Object.keys(dataCostsData.dataCosts.data[0]);
      dataKeys.splice(dataKeys.indexOf('id'), 1);
      dataKeys.push('id');
      this.displayedColumns = dataKeys;
    } else {
      this.displayedColumns = ['No item'];
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

  private setPaginator(dataCostsData: any): void {
    this.pageIndex = dataCostsData.pageIndex;
    this.pageSize = dataCostsData.pageSize;
    this.length = dataCostsData.totalItems;
    this.pageSizeOptions = [10, 25, 50];
  }

  private resetSort(): void {
    if (this.sort) {
      this.sort.active = '';
      this.sort.direction = '';
      this.sort._stateChanges.next();
      this.dataSource.sort = this.sort;
      this.currentUserId = this.tableData.data._id;
    }
  }

  private resetFiltersObj(): void {
    this.filters = null;
  }

  private removeItem(userId: string): void {
    // this.projectDetailsService
    //   .deleteProjectItem(
    //     this.dataCostsData.dataCosts._id,
    //     dataItemId,
    //     this.filters
    //   )
    //   .pipe(
    //     take(1),
    //     finalize(() => {
    //       this.isLoading = false;
    //     })
    //   )
    //   .subscribe({
    //     next: (data) => {
    //       this.checkIfDataAndUpdate(data);
    //       this.setPaginator(data);
    //       this.dataSource.data = data.dataCosts.data;
    //       this.notificationService.info('The item was deleted');
    //     },
    //     error: (err) => {
    //       this.notificationService.error(err.error.message);
    //     },
    //   });
  }
}

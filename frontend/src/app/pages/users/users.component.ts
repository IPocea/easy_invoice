import { Component, OnInit } from '@angular/core';
import { ITableFilters, IUser, IUserPagination } from '@interfaces';
import { StorageService, UserService } from '@services';
import { take } from 'rxjs';
@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements OnInit {
  isLoading: boolean = false;
  isEditingOrDeleting: boolean = false;
  usersPagination: IUserPagination = null;
  defaultFilters: ITableFilters = {
    pageIndex: '0',
    pageSize: '10',
  };

  constructor(
    private userService: UserService,
    private storageService: StorageService
  ) {}

  ngOnInit(): void {
    const defaultPageSize = this.storageService.getItem('pageSize')
      ? (this.storageService.getItem('pageSize') as string)
      : '10';
    this.defaultFilters.pageSize = defaultPageSize;
    this.getUsers(this.defaultFilters);
  }

  requestUsers(ev: ITableFilters): void {
    this.getUsers(ev);
  }

  private getUsers(filters: ITableFilters): void {
    this.userService
      .getAllUsers(filters)
      .pipe(take(1))
      .subscribe({
        next: (userPagination) => {
          this.usersPagination = userPagination;
        },
        error: (err) => {},
      });
  }
}

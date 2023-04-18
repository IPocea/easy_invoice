import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  IEditDeleteResponse,
  ITableFilters,
  IUser,
  IUserPagination,
} from '@interfaces';
import { setFullAvailableFilters, setPageSize } from '@utils';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient) {}

  getProfile(): Observable<IUser> {
    return this.http.get<IUser>(environment.baseUrl + 'profile');
  }

  createUser(user: IUser, filters: ITableFilters): Observable<IUserPagination> {
    const pageSizeQuery = setPageSize(filters);
    return this.http.post<IUserPagination>(
      environment.baseUrl + `users/add${pageSizeQuery}`,
      user
    );
  }

  getAllUsers(filters: ITableFilters): Observable<IUserPagination> {
    const filtersString = filters ? setFullAvailableFilters(filters) : '';
    return this.http.get<IUserPagination>(
      environment.baseUrl + `users${filtersString}`
    );
  }

  deleteUser(_id: string, filters: ITableFilters): Observable<IUserPagination> {
    const filtersString = filters ? setFullAvailableFilters(filters) : '';
    return this.http.delete<IUserPagination>(
      environment.baseUrl + `users/${_id}${filtersString}`
    );
  }

  updateUserStatus(
    _id: string,
    isActivated: boolean,
    filters: ITableFilters
  ): Observable<IUserPagination> {
    const filtersString = filters ? setFullAvailableFilters(filters) : '';
    return this.http.patch<IUserPagination>(
      environment.baseUrl + `users/${_id}${filtersString}`,
      { isActivated: isActivated }
    );
  }

  updateUserPassword(
    _id: string,
    password: string,
    filters: ITableFilters
  ): Observable<IUserPagination> {
    const filtersString = filters ? setFullAvailableFilters(filters) : '';
    return this.http.patch<IUserPagination>(
      environment.baseUrl + `users/${_id}/change-password${filtersString}`,
      { password: password }
    );
  }

  updateOwnPassword(
    _id: string,
    password: string
  ): Observable<IEditDeleteResponse> {
    return this.http.patch<IEditDeleteResponse>(
      environment.baseUrl + 'profile/change-password',
      {
        userId: _id,
        password: password,
      }
    );
  }

  updateUser(
    _id: string,
    user: IUser,
    filters: ITableFilters
  ): Observable<IUserPagination> {
    const filtersString = filters ? setFullAvailableFilters(filters) : '';
    return this.http.patch<IUserPagination>(
      environment.baseUrl + `users/${_id}/edit-user${filtersString}`,
      user
    );
  }
}

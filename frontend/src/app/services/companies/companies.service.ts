import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ICompany, ICompanyPagination, ITableFilters } from '@interfaces';
import { setFullAvailableFilters } from '@utils';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CompaniesService {
  constructor(private http: HttpClient) {}

  getAllCompanies(filters: ITableFilters): Observable<ICompanyPagination> {
    const filtersString = filters ? setFullAvailableFilters(filters) : '';
    return this.http.get<ICompanyPagination>(
      environment.baseUrl + `companies${filtersString}`
    );
  }

  getAllActiveCompanies(filters: ITableFilters): Observable<ICompanyPagination> {
    const filtersString = filters ? setFullAvailableFilters(filters) : '';
    return this.http.get<ICompanyPagination>(
      environment.baseUrl + `companies/actives/get-all${filtersString}`
    );
  }

  createCompany(
    company: ICompany,
    filters: ITableFilters
  ): Observable<ICompanyPagination> {
    const filtersString = filters ? setFullAvailableFilters(filters) : '';
    return this.http.post<ICompanyPagination>(
      environment.baseUrl + `companies/add${filtersString}`,
      company
    );
  }

  createCompanyAndReturnIt(company: ICompany): Observable<ICompany> {
    return this.http.post<ICompany>(
      environment.baseUrl + 'companies/add-and-return-company',
      company
    );
  }

  toggleStatus(
    _id: string,
    isActivated: boolean,
    filters: ITableFilters
  ): Observable<ICompanyPagination> {
    const filtersString = filters ? setFullAvailableFilters(filters) : '';
    return this.http.patch<ICompanyPagination>(
      environment.baseUrl + `companies/${_id}/update-status${filtersString}`,
      { isActivated: isActivated }
    );
  }

  updateCompany(
    _id: string,
    updatedCompany: ICompany,
    filters: ITableFilters
  ): Observable<ICompanyPagination> {
    const filtersString = filters ? setFullAvailableFilters(filters) : '';
    return this.http.patch<ICompanyPagination>(
      environment.baseUrl + `companies/${_id}/edit-company${filtersString}`,
      updatedCompany
    );
  }

  deleteCompany(
    _id: string,
    filters: ITableFilters
  ): Observable<ICompanyPagination> {
    const filtersString = filters ? setFullAvailableFilters(filters) : '';
    return this.http.delete<ICompanyPagination>(
      environment.baseUrl + `companies/${_id}${filtersString}`
    );
  }
}

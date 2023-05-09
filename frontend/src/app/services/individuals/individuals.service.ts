import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IIndividual, IIndividualPagination, ITableFilters } from '@interfaces';
import { setFullAvailableFilters } from '@utils';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class IndividualsService {
  constructor(private http: HttpClient) {}

  getAllIndividuals(filters: ITableFilters): Observable<IIndividualPagination> {
    const filtersString = filters ? setFullAvailableFilters(filters) : '';
    return this.http.get<IIndividualPagination>(
      environment.baseUrl + `individuals${filtersString}`
    );
  }

  getAllActiveIndividuals(filters: ITableFilters): Observable<IIndividualPagination> {
    const filtersString = filters ? setFullAvailableFilters(filters) : '';
    return this.http.get<IIndividualPagination>(
      environment.baseUrl + `individuals/actives/get-all${filtersString}`
    );
  }

  createIndividual(
    individual: IIndividual,
    filters: ITableFilters
  ): Observable<IIndividualPagination> {
    const filtersString = filters ? setFullAvailableFilters(filters) : '';
    return this.http.post<IIndividualPagination>(
      environment.baseUrl + `individuals/add${filtersString}`,
      individual
    );
  }

  createIndividualAndReturnIt(
    individual: IIndividual
  ): Observable<IIndividual> {
    return this.http.post<IIndividual>(
      environment.baseUrl + 'individuals/add-and-return-individual',
      individual
    );
  }

  toggleStatus(
    _id: string,
    isActivated: boolean,
    filters: ITableFilters
  ): Observable<IIndividualPagination> {
    const filtersString = filters ? setFullAvailableFilters(filters) : '';
    return this.http.patch<IIndividualPagination>(
      environment.baseUrl + `individuals/${_id}/update-status${filtersString}`,
      { isActivated: isActivated }
    );
  }

  updateIndividual(
    _id: string,
    updatedIndividual: IIndividual,
    filters: ITableFilters
  ): Observable<IIndividualPagination> {
    const filtersString = filters ? setFullAvailableFilters(filters) : '';
    return this.http.patch<IIndividualPagination>(
      environment.baseUrl +
        `individuals/${_id}/edit-individual${filtersString}`,
      updatedIndividual
    );
  }

  deleteIndividual(
    _id: string,
    filters: ITableFilters
  ): Observable<IIndividualPagination> {
    const filtersString = filters ? setFullAvailableFilters(filters) : '';
    return this.http.delete<IIndividualPagination>(
      environment.baseUrl + `individuals/${_id}${filtersString}`
    );
  }
}

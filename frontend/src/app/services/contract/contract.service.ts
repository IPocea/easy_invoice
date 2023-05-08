import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { IContractPagination, ITableFilters } from '@interfaces';
import { setFullAvailableFilters } from '@utils/index';

@Injectable({
  providedIn: 'root',
})
export class ContractService {
  constructor(private http: HttpClient) {}

  getAll(filters: ITableFilters): Observable<IContractPagination> {
    const filtersString = filters ? setFullAvailableFilters(filters) : '';
    return this.http.get<IContractPagination>(
      environment.baseUrl + `contracts${filtersString}`
    );
  }

  getContractAsPdf(contractId: string): Observable<any> {
    return this.http.get<any>(
      environment.baseUrl + `contracts/${contractId}/get-pdf`,
      { responseType: 'blob' as 'json' }
    );
  }
}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  IContractModel,
  IContractModelResponse,
  ITableFilters,
} from '@interfaces';
import { setFullAvailableFilters } from '@utils';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ContractModelService {
  constructor(private http: HttpClient) {}

  getContractModels(filters: ITableFilters): Observable<IContractModel[]> {
    const filtersString = filters ? setFullAvailableFilters(filters) : '';
    return this.http.get<IContractModel[]>(
      environment.baseUrl + `contract-models${filtersString}`
    );
  }

  addContractModel(
    contractModel: IContractModel
  ): Observable<IContractModelResponse> {
    return this.http.post<IContractModelResponse>(
      environment.baseUrl + 'contract-models/add',
      contractModel
    );
  }

  editContractModel(
    modelId: string,
    contractModel: IContractModel
  ): Observable<IContractModelResponse> {
    return this.http.patch<IContractModelResponse>(
      environment.baseUrl + `contract-models/${modelId}/edit-contract-model`,
      contractModel
    );
  }

  deleteContractModel(
    modelId: string,
    filters: ITableFilters
  ): Observable<IContractModel[]> {
    const filtersString = filters ? setFullAvailableFilters(filters) : '';
    return this.http.delete<IContractModel[]>(
      environment.baseUrl + `contract-models/${modelId}${filtersString}`
    );
  }
}

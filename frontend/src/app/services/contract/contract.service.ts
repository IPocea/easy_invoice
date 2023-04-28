import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ContractService {
  constructor(private http: HttpClient) {}

  getContractAsPdf(contractId: string): Observable<any> {
    return this.http.get<any>(
      environment.baseUrl + `contracts/${contractId}/get-pdf`,
      { responseType: 'blob' as 'json' }
    );
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IHistoryAction } from '@interfaces';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class HistoryService {
  constructor(private http: HttpClient) {}

  getAllOfInvoice(invoiceId: string): Observable<IHistoryAction[]> {
    return this.http.get<IHistoryAction[]>(
      environment.baseUrl + `histories/${invoiceId}`
    );
  }
}

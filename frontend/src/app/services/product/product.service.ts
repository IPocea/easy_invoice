import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IEditDeleteResponse, IProduct } from '@interfaces';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor(private http: HttpClient) {}

  getAllOfInvoice(invoiceId: string): Observable<IProduct[]> {
    return this.http.get<IProduct[]>(
      environment.baseUrl + `products/${invoiceId}`
    );
  }

  deleteOne(productId: string): Observable<IEditDeleteResponse> {
    return this.http.delete<IEditDeleteResponse>(
      environment.baseUrl + `products/${productId}`
    );
  }
}

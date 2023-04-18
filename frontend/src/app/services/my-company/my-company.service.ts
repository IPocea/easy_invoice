import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IMyCompany } from '@interfaces';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MyCompanyService {
  constructor(
    private http: HttpClient
  ) {}

  getMyCompany(): Observable<IMyCompany[]> {
    return this.http.get<IMyCompany[]>(
      environment.baseUrl+ 'my-company'
    );
  }

  addMyCompany(myCompany: IMyCompany): Observable<IMyCompany> {
    return this.http.post<IMyCompany>(
      environment.baseUrl+ 'my-company',
      myCompany
    );
  }

  editMyCompany(
    myCompany: IMyCompany,
    companyId: string
  ): Observable<IMyCompany> {
    return this.http.patch<IMyCompany>(
      environment.baseUrl+ `my-company/${companyId}`,
      myCompany
    );
  }
}

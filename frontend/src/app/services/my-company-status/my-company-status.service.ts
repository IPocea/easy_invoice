import { Injectable } from '@angular/core';
import { IMyCompany } from '@interfaces';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MyCompanyStatusService {
  myCompany: IMyCompany = null;
  company: BehaviorSubject<IMyCompany>;

  constructor() {
    this.company = new BehaviorSubject(this.myCompany);
  }

  setMyCompanyData(company: IMyCompany) {
    this.company.next(company);
  }

  getMycompanyData() {
    return this.company.value;
  }
}

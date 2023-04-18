import { Injectable } from '@angular/core';
import { IMyCompany, IUser } from '@interfaces';
import { ILoginDataBehavior } from 'interfaces/login-data.interface';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoginDataService {
  loginStatus: boolean = false;
  user: IUser = null;
  loginData: BehaviorSubject<IUser>;

  constructor() {
    this.loginData = new BehaviorSubject(this.user);
  }

  setNextLoggedUser(user: IUser) {
    this.loginData.next(user);
  }

  getLoggedUser() {
    return this.loginData.value;
  }
}

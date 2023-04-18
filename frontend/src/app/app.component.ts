import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription, take } from 'rxjs';
import {
  LoginDataService,
  MyCompanyService,
  MyCompanyStatusService,
  UserService,
} from '@services';
import { IMyCompany, IUser } from '@interfaces';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'EasyInvoice';
  isLoggedIn: boolean = false;
  isLoading: boolean = true;
  user: IUser = null;
  myCompany: IMyCompany = null;
  loginDataSubscription: Subscription;
  myCompanySubscription: Subscription;
  pathName: string = '';

  constructor(
    private loginDataService: LoginDataService,
    private myCompanyStatusService: MyCompanyStatusService,
    private titleService: Title,
    private userService: UserService,
    private myCompanyService: MyCompanyService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loginDataSubscription = this.loginDataService.loginData.subscribe(
      (data) => {
        this.user = data;
      }
    );
    this.myCompanySubscription = this.myCompanyStatusService.company.subscribe(
      (company) => {
        this.myCompany = company;
        if (this.myCompany) {
          this.titleService.setTitle(this.myCompany.name);
        }
      }
    );
    this.pathName = window.location.pathname;
    this.getProfile();
  }

  private getProfile(): void {
    this.userService
      .getProfile()
      .pipe(take(1))
      .subscribe({
        next: (profile) => {
          this.user = profile;
          this.loginDataService.setNextLoggedUser(profile);
          this.getMyCompany();
        },
        error: (err) => {
          this.isLoading = false;
          if (!this.pathName.includes('/reseteaza-parola')) {
            this.router.navigate(['/login']);
          }
        },
      });
  }

  private getMyCompany(): void {
    this.myCompanyService
      .getMyCompany()
      .pipe(take(1))
      .subscribe({
        next: (company) => {
          if (company.length) {
            this.myCompany = company[0];
            this.titleService.setTitle(this.myCompany.name);
            this.myCompanyStatusService.setMyCompanyData(company[0]);
          } else {
            this.router.navigate(['/adauga-societatea-mea']);
          }
          this.isLoading = false;
        },
        error: (err) => {
          this.isLoading = false;
          if (!this.pathName.includes('/reseteaza-parola')) {
            this.router.navigate(['/login']);
          }
        },
      });
  }

  ngOnDestroy(): void {
    this.loginDataSubscription?.unsubscribe();
    this.myCompanySubscription?.unsubscribe();
  }
}

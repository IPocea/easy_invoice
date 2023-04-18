import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IMyCompany, IUser } from '@interfaces';
import {
  LoginDataService,
  MyCompanyService,
  MyCompanyStatusService,
  NotificationService,
} from '@services';
import { take } from 'rxjs/operators';
import { cleanForm } from '@utils';

@Component({
  selector: 'app-setup-my-company',
  templateUrl: './setup-my-company.component.html',
  styleUrls: ['./setup-my-company.component.scss'],
})
export class SetupMyCompanyComponent implements OnInit {
  myCompany: IMyCompany | null = null;
  addMyCompanyForm: FormGroup;
  addMyCompanyBtnMessage: string = 'Adauga datele firmei';
  errorMessage: string = '';
  isLoading: boolean = false;
  currentUser: IUser | null = null;
  constructor(
    private fb: FormBuilder,
    private loginDataService: LoginDataService,
    private myCompanyStatusService: MyCompanyStatusService,
    private myCompanyService: MyCompanyService,
    private notificationService: NotificationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentUser = this.loginDataService.getLoggedUser();
    this.myCompany = this.myCompanyStatusService.getMycompanyData();
    if (this.myCompany) {
      this.router.navigate(['/bine-ai-venit']);
    } else {
      this.addMyCompanyForm = this.fb.group({
        name: [null, [Validators.required]],
        J: [null, [Validators.required]],
        CUI: [null, [Validators.required]],
        headquarters: [null, [Validators.required]],
        county: [null, [Validators.required]],
        bankAccount: [null],
        bank: [null],
        treasury: [null],
        socialCapital: [null],
        vatRate: [null, [Validators.required, Validators.pattern(/[0-9]+/g)]],
        delegatesName: [null],
        addedBy: [this.currentUser.firstName + ' ' + this.currentUser.lastName],
        editedBy: [null],
      });
    }
  }

  addMyCompany(): void {
    cleanForm(this.addMyCompanyForm);
    this.isLoading = true;
    this.myCompanyService
      .addMyCompany(this.addMyCompanyForm.value)
      .pipe(take(1))
      .subscribe({
        next: (myCreatedCompany) => {
          this.myCompanyStatusService.setMyCompanyData(myCreatedCompany);
          this.router.navigate(['/bine-ai-venit']);
        },
        error: (err) => {
          this.notificationService.error(err.error.message);
          this.isLoading = false;
        },
      });
  }
}

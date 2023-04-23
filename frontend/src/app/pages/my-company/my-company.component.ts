import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IMyCompany, IUser } from '@interfaces';
import {
  LoginDataService,
  MyCompanyService,
  MyCompanyStatusService,
  NotificationService,
} from '@services';
import { cleanForm } from '@utils';
import { finalize, take } from 'rxjs';

@Component({
  selector: 'app-my-company',
  templateUrl: './my-company.component.html',
  styleUrls: ['./my-company.component.scss'],
})
export class MyCompanyComponent implements OnInit {
  myCompany: IMyCompany | null = null;
  editMyCompanyForm: FormGroup;
  editMyCompanyBtnMessage: string = 'Editeaza datele firmei';
  currentUser: IUser | null = null;
  isLoading: boolean = true;
  isEditing: boolean = false;
  constructor(
    private fb: FormBuilder,
    private loginDataService: LoginDataService,
    private myCompanyStatusService: MyCompanyStatusService,
    private myCompanyService: MyCompanyService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.loginDataService.getLoggedUser();
    this.getMyCompany();
  }

  editMyCompany(): void {
    this.isEditing = true;
    this.editMyCompanyBtnMessage = 'Se editeaza...';
    this.updateMyCompany();
  }

  private getMyCompany(): void {
    this.myCompanyService
      .getMyCompany()
      .pipe(
        take(1),
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe({
        next: (company) => {
          if (company.length) {
            this.myCompany = company[0];
            this.myCompanyStatusService.setMyCompanyData(company[0]);
            this.editMyCompanyForm = this.fb.group({
              name: [this.myCompany.name, [Validators.required]],
              J: [this.myCompany.J, [Validators.required]],
              CUI: [this.myCompany.CUI, [Validators.required]],
              headquarters: [
                this.myCompany.headquarters,
                [Validators.required],
              ],
              county: [this.myCompany.county, [Validators.required]],
              bankAccount: [this.myCompany.bankAccount],
              bank: [this.myCompany.bank],
              treasury: [this.myCompany.treasury],
              socialCapital: [this.myCompany.socialCapital],
              vatRate: [this.myCompany.vatRate, [Validators.required]],
              delegatesName: [this.myCompany.delegatesName],
              email: [this.myCompany.email],
              phone: [this.myCompany.phone],
              addedBy: [this.myCompany.addedBy],
              editedBy: [
                this.currentUser.firstName + ' ' + this.currentUser.lastName,
              ],
            });
          }
        },
        error: (err) => {},
      });
  }

  private updateMyCompany(): void {
    cleanForm(this.editMyCompanyForm);
    this.myCompanyService
      .editMyCompany(this.editMyCompanyForm.value, this.myCompany._id)
      .pipe(
        take(1),
        finalize(() => {
          this.isEditing = false;
        })
      )
      .subscribe({
        next: (myCompany) => {
          this.myCompanyStatusService.setMyCompanyData(myCompany);
          this.myCompany = myCompany;
          this.notificationService.info(
            'Societatea a fost modificata cu succes'
          );
        },
        error: (err) => {
          this.notificationService.error(err.error.message);
        },
      });
  }
}

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import {
  ICompany,
  ICompanyPagination,
  IStatusChoices,
  ITableFilters,
  IUser,
} from '@interfaces';
import {
  CompaniesService,
  LoginDataService,
  NotificationService,
} from '@services';
import { cleanForm, emailRegExp } from '@utils';
import { finalize, take } from 'rxjs';

@Component({
  selector: 'app-add-company',
  templateUrl: './add-edit-company.component.html',
  styleUrls: ['./add-edit-company.component.scss'],
})
export class AddEditCompanyComponent implements OnInit {
  currentUser: IUser = null;
  filters: ITableFilters = null;
  company: ICompany = null;
  isLoading: boolean = false;
  addEditCompanyForm: FormGroup;
  addEditCompanyBtnMessage: string = 'Adauga Societate';
  emailPattern: RegExp = emailRegExp();
  companyStatusChoices: IStatusChoices[] = [
    { value: true, viewValue: 'Activa' },
    { value: false, viewValue: 'Inactiva' },
  ];
  constructor(
    public dialogRef: MatDialogRef<AddEditCompanyComponent>,
    private fb: FormBuilder,
    private loginDataService: LoginDataService,
    private companiesService: CompaniesService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.loginDataService.getLoggedUser();
    this.addEditCompanyBtnMessage = this.company
      ? 'Editeaza Societatea'
      : 'Adauga Societate';
    if (this.company) {
      this.addEditCompanyForm = this.fb.group({
        name: [this.company.name, [Validators.required]],
        J: [this.company.J, [Validators.required]],
        CUI: [this.company.CUI, [Validators.required]],
        headquarters: [this.company.headquarters, [Validators.required]],
        county: [this.company.county, [Validators.required]],
        vatRate: [this.company.vatRate],
        bankAccount: [this.company.bankAccount],
        bank: [this.company.bank],
        email: [this.company.email, [Validators.pattern(this.emailPattern)]],
        phone: [this.company.phone],
        isActivated: [this.company.isActivated, [Validators.required]],
        addedBy: [this.company.addedBy, [Validators.required]],
        editedBy: [
          this.currentUser.firstName + ' ' + this.currentUser.lastName,
          [Validators.required],
        ],
      });
    } else {
      this.addEditCompanyForm = this.fb.group({
        name: [null, [Validators.required]],
        J: [null, [Validators.required]],
        CUI: [null, [Validators.required]],
        headquarters: [null, [Validators.required]],
        county: [null, [Validators.required]],
        vatRate: [null],
        bankAccount: [null],
        bank: [null],
        email: [null, [Validators.pattern(this.emailPattern)]],
        phone: [null],
        isActivated: [true, [Validators.required]],
        addedBy: [
          this.currentUser.firstName + ' ' + this.currentUser.lastName,
          [Validators.required],
        ],
        editedBy: [null],
      });
    }
  }

  addEditCompany(): void {
    this.isLoading = true;
    this.addEditCompanyBtnMessage = this.company
      ? 'Se editeaza...'
      : 'Se adauga...';
    cleanForm(this.addEditCompanyForm);
    if (this.company) {
      this.editCompany(this.company._id, this.addEditCompanyForm.value);
    } else {
      this.createCompany(this.addEditCompanyForm.value);
    }
  }

  closeDialog(): void {
    this.dialogRef.close({ event: 'Cancel' });
  }

  private createCompany(company: ICompany): void {
    this.companiesService
      .createCompany(company, this.filters)
      .pipe(
        take(1),
        finalize(() => {
          this.isLoading = false;
          this.addEditCompanyBtnMessage = this.company
            ? 'Editeaza Societatea'
            : 'Adauga Societate';
        })
      )
      .subscribe({
        next: (companyData: ICompanyPagination) => {
          this.dialogRef.close({
            event: 'Add Company',
            companyData: companyData,
          });
        },
        error: (err) => {
          this.notificationService.error(
            err.error.message ||
              'A intervenit o eroare. Te rugam sa dai refresh la pagina si sa incerci din nou'
          );
        },
      });
  }

  private editCompany(companyId: string, company: ICompany): void {
    this.companiesService
      .updateCompany(companyId, company, this.filters)
      .pipe(
        take(1),
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe({
        next: (companyData: ICompanyPagination) => {
          this.dialogRef.close({
            event: 'Edit Company',
            companyData: companyData,
          });
        },
        error: (err) => {
          this.notificationService.error(
            err.error.message ||
              'A intervenit o eroare. Te rugam sa dai refresh la pagina si sa incerci din nou'
          );
        },
      });
  }
}

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { IBuyer, IStatusChoices, ITableFilters, IUser } from '@interfaces';
import {
  CompaniesService,
  IndividualsService,
  NotificationService,
} from '@services';
import { cleanForm, emailRegExp, integralNumbersOnly } from '@utils/index';
import { finalize, take } from 'rxjs';

@Component({
  selector: 'app-add-change-buyer',
  templateUrl: './add-change-buyer.component.html',
  styleUrls: ['./add-change-buyer.component.scss'],
})
export class AddChangeBuyerComponent implements OnInit {
  currentUser: IUser = null;
  buyers: IBuyer[] = [];
  isSearchBarDisplayed: boolean = false;
  isBuyerCompany: boolean = false;
  isLoading: boolean = false;
  isNotFoundDisplayed: boolean = false;
  isAddFormDisplayed: boolean = false;
  searchValue: string = '';
  typingTimer: ReturnType<typeof setTimeout>;
  typingInt: number = 350;
  filters: ITableFilters = {
    pageIndex: '0',
    pageSize: '10',
  };
  addIndivOrCompForm: FormGroup;
  addIndivOrCompFormBtnMessage: string = '';
  emailPattern: RegExp = emailRegExp();
  CNPPattern: RegExp = integralNumbersOnly;
  individualStatusChoices: IStatusChoices[] = [
    { value: true, viewValue: 'Activa' },
    { value: false, viewValue: 'Inactiva' },
  ];

  constructor(
    public dialogRef: MatDialogRef<AddChangeBuyerComponent>,
    private companiesService: CompaniesService,
    private individualsService: IndividualsService,
    private notificationService: NotificationService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {}

  addIndivOrComp(): void {
    this.isLoading = true;
    this.addIndivOrCompFormBtnMessage = 'Se adauga...';
    cleanForm(this.addIndivOrCompForm);
    if (this.isBuyerCompany) {
      this.addCompany();
    } else {
      this.addIndividual();
    }
  }

  closeDialog(): void {
    this.dialogRef.close({ event: 'Cancel' });
  }

  displayAddForm(): void {
    this.setAddIndivOrCompForm();
    this.isSearchBarDisplayed = false;
    this.isAddFormDisplayed = true;
  }

  displaySearchBar(buyerType: string): void {
    this.isAddFormDisplayed = false;
    this.isBuyerCompany = buyerType === 'companies' ? true : false;
    this.isSearchBarDisplayed = true;
  }

  applySearchFilter(): void {
    this.clearTimeout();
    this.typingTimer = setTimeout(
      this.searchByValue.bind(this),
      this.typingInt
    );
  }

  clearTimeout(): void {
    clearTimeout(this.typingTimer);
  }

  clearSearchValue(): void {
    this.searchValue = '';
    this.isNotFoundDisplayed = false;
    this.searchByValue();
  }

  sendBuyer(buyer: IBuyer): void {
    this.dialogRef.close({ event: 'Send Buyer', buyer: buyer });
  }

  private addCompany(): void {
    this.companiesService
      .createCompanyAndReturnIt(this.addIndivOrCompForm.value)
      .pipe(
        take(1),
        finalize(() => {
          this.isLoading = false;
          this.addIndivOrCompFormBtnMessage = 'Adauga societate';
        })
      )
      .subscribe({
        next: (company) => {
          this.sendBuyer(company);
        },
        error: (err) => {
          this.notificationService.error(err.error.message);
        },
      });
  }

  private addIndividual(): void {
    this.individualsService
      .createIndividualAndReturnIt(this.addIndivOrCompForm.value)
      .pipe(
        take(1),
        finalize(() => {
          this.isLoading = false;
          this.addIndivOrCompFormBtnMessage = 'Adauga persoana fizica';
        })
      )
      .subscribe({
        next: (individual) => {
          this.sendBuyer(individual);
        },
        error: (err) => {
          this.notificationService.error(err.error.message);
        },
      });
  }

  private searchByValue(): void {
    this.isNotFoundDisplayed = false;
    if (this.searchValue.trim()) {
      this.filters.searchValue = this.searchValue.trim();
      if (this.isBuyerCompany) {
        this.searchCompanies();
      } else {
        this.searchIndividuals();
      }
    } else {
      this.buyers = [];
    }
  }

  private setAddIndivOrCompForm(): void {
    this.addIndivOrCompFormBtnMessage = this.isBuyerCompany
      ? 'Adauga societate'
      : 'Adauga persoana fizica';
    const indivOrCompFormGroup = this.isBuyerCompany
      ? this.fb.group({
          name: [null, [Validators.required]],
          J: [null, [Validators.required]],
          CUI: [null, [Validators.required]],
          headquarters: [null, [Validators.required]],
          county: [null, [Validators.required]],
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
        })
      : this.fb.group({
          name: [null, [Validators.required]],
          series: [null, [Validators.required]],
          CNP: [
            null,
            [Validators.required, Validators.pattern(this.CNPPattern)],
          ],
          headquarters: [null, [Validators.required]],
          county: [null, [Validators.required]],
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

    this.addIndivOrCompForm = indivOrCompFormGroup;
  }

  private searchCompanies(): void {
    this.companiesService
      .getAllCompanies(this.filters)
      .pipe(take(1))
      .subscribe({
        next: (companies) => {
          this.buyers = companies.data;
          if(!this.buyers.length) {
            this.isNotFoundDisplayed = true;
          }
        },
        error: (err) => {
          this.buyers = [];
          this.isNotFoundDisplayed = true;
          this.notificationService.error(err.error.message);
        },
      });
  }

  private searchIndividuals(): void {
    this.individualsService
      .getAllIndividuals(this.filters)
      .pipe(take(1))
      .subscribe({
        next: (individuals) => {
          this.buyers = individuals.data;
          if(!this.buyers.length) {
            this.isNotFoundDisplayed = true;
          }
        },
        error: (err) => {
          this.buyers = [];
          this.isNotFoundDisplayed = true;
          this.notificationService.error(err.error.message);
        },
      });
  }
}

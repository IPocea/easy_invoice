import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import {
  IIndividual,
  IIndividualPagination,
  IStatusChoices,
  ITableFilters,
  IUser,
} from '@interfaces';
import {
  IndividualsService,
  LoginDataService,
  NotificationService,
} from '@services';
import { cleanForm, emailRegExp, integralNumbersOnly } from '@utils';
import { finalize, take } from 'rxjs';

@Component({
  selector: 'app-add-edit-individual',
  templateUrl: './add-edit-individual.component.html',
  styleUrls: ['./add-edit-individual.component.scss'],
})
export class AddEditIndividualComponent implements OnInit {
  currentUser: IUser = null;
  filters: ITableFilters = null;
  individual: IIndividual = null;
  isLoading: boolean = false;
  addEditIndividualForm: FormGroup;
  addEditIndividualBtnMessage: string = 'Adauga persoana fizica';
  emailPattern: RegExp = emailRegExp();
  CNPPattern: RegExp = integralNumbersOnly;
  individualStatusChoices: IStatusChoices[] = [
    { value: true, viewValue: 'Activa' },
    { value: false, viewValue: 'Inactiva' },
  ];

  constructor(
    public dialogRef: MatDialogRef<AddEditIndividualComponent>,
    private fb: FormBuilder,
    private loginDataService: LoginDataService,
    private individualsService: IndividualsService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.loginDataService.getLoggedUser();
    this.addEditIndividualBtnMessage = this.individual
      ? 'Editeaza Persoana Fizica'
      : 'Adauga Persoana Fizica';
    if (this.individual) {
      this.addEditIndividualForm = this.fb.group({
        name: [this.individual.name, [Validators.required]],
        series: [this.individual.series, [Validators.required]],
        CNP: [
          this.individual.CNP,
          [Validators.required, Validators.pattern(this.CNPPattern)],
        ],
        headquarters: [this.individual.headquarters, [Validators.required]],
        county: [this.individual.county, [Validators.required]],
        bankAccount: [this.individual.bankAccount],
        bank: [this.individual.bank],
        email: [this.individual.email, [Validators.pattern(this.emailPattern)]],
        phone: [this.individual.phone],
        isActivated: [this.individual.isActivated, [Validators.required]],
        addedBy: [this.individual.addedBy, [Validators.required]],
        editedBy: [
          this.currentUser.firstName + ' ' + this.currentUser.lastName,
          [Validators.required],
        ],
      });
    } else {
      this.addEditIndividualForm = this.fb.group({
        name: [null, [Validators.required]],
        series: [null, [Validators.required]],
        CNP: [
          null,
          [Validators.required, , Validators.pattern(this.CNPPattern)],
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
    }
  }

  addEditIndividual(): void {
    this.isLoading = true;
    this.addEditIndividualBtnMessage = this.individual
      ? 'Se editeaza...'
      : 'Se adauga...';
    cleanForm(this.addEditIndividualForm);
    if (this.individual) {
      this.editIndividual(
        this.individual._id,
        this.addEditIndividualForm.value
      );
    } else {
      this.createIndividual(this.addEditIndividualForm.value);
    }
  }

  closeDialog(): void {
    this.dialogRef.close({ event: 'Cancel' });
  }

  private createIndividual(individual: IIndividual): void {
    this.individualsService
      .createIndividual(individual, this.filters)
      .pipe(
        take(1),
        finalize(() => {
          this.isLoading = false;
          this.addEditIndividualBtnMessage = this.individual
            ? 'Editeaza Persoana Fizica'
            : 'Adauga Persoana Fizica';
        })
      )
      .subscribe({
        next: (individualData: IIndividualPagination) => {
          this.dialogRef.close({
            event: 'Add Individual',
            individualData: individualData,
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

  private editIndividual(individualId: string, individual: IIndividual): void {
    this.individualsService
      .updateIndividual(individualId, individual, this.filters)
      .pipe(
        take(1),
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe({
        next: (individualData: IIndividualPagination) => {
          this.dialogRef.close({
            event: 'Edit Individual',
            individualData: individualData,
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

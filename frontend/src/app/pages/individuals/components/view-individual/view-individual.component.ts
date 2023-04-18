import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { IIndividual, IStatusChoices, ITableFilters } from '@interfaces';

@Component({
  selector: 'app-view-individual',
  templateUrl: './view-individual.component.html',
  styleUrls: ['./view-individual.component.scss'],
})
export class ViewIndividualComponent implements OnInit {
  individual: IIndividual = null;
  filters: ITableFilters = null;
  viewIndividualForm: FormGroup;
  individualStatusChoices: IStatusChoices[] = [
    { value: true, viewValue: 'Activa' },
    { value: false, viewValue: 'Inactiva' },
  ];

  constructor(
    public dialogRef: MatDialogRef<ViewIndividualComponent>,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.individual.editedBy = this.individual.editedBy
      ? this.individual.editedBy
      : 'Nemodificat';
    this.viewIndividualForm = this.fb.group({
      name: [{ value: this.individual.name, disabled: true }],
      J: [{ value: this.individual.series, disabled: true }],
      CUI: [{ value: this.individual.CNP, disabled: true }],
      headquarters: [{ value: this.individual.headquarters, disabled: true }],
      county: [{ value: this.individual.county, disabled: true }],
      bankAccount: [{ value: this.individual.bankAccount, disabled: true }],
      bank: [{ value: this.individual.bank, disabled: true }],
      email: [{ value: this.individual.email, disabled: true }],
      phone: [{ value: this.individual.phone, disabled: true }],
      isActivated: [{ value: this.individual.isActivated, disabled: true }],
      addedBy: [{ value: this.individual.addedBy, disabled: true }],
      editedBy: [{ value: this.individual.editedBy, disabled: true }],
    });
    this.viewIndividualForm.disable();
  }

  closeDialog(): void {
    this.dialogRef.close({ event: 'Cancel' });
  }
}

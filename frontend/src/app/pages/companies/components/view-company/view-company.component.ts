import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { ICompany, IStatusChoices, ITableFilters } from '@interfaces';

@Component({
  selector: 'app-view-company',
  templateUrl: './view-company.component.html',
  styleUrls: ['./view-company.component.scss'],
})
export class ViewCompanyComponent implements OnInit {
  company: ICompany = null;
  filters: ITableFilters = null;
  viewCompanyForm: FormGroup;
  companyStatusChoices: IStatusChoices[] = [
    { value: true, viewValue: 'Activa' },
    { value: false, viewValue: 'Inactiva' },
  ];
  constructor(
    public dialogRef: MatDialogRef<ViewCompanyComponent>,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.company.editedBy = this.company.editedBy ? this.company.editedBy : 'Nemodificat';
    this.viewCompanyForm = this.fb.group({
      name: [{ value: this.company.name, disabled: true }],
      J: [{ value: this.company.J, disabled: true }],
      CUI: [{ value: this.company.CUI, disabled: true }],
      headquarters: [{ value: this.company.headquarters, disabled: true }],
      county: [{ value: this.company.county, disabled: true }],
      vatRate: [{ value: this.company.vatRate, disabled: true }],
      bankAccount: [{ value: this.company.bankAccount, disabled: true }],
      bank: [{ value: this.company.bank, disabled: true }],
      email: [{ value: this.company.email, disabled: true }],
      phone: [{ value: this.company.phone, disabled: true }],
      isActivated: [{ value: this.company.isActivated, disabled: true }],
      addedBy: [{ value: this.company.addedBy, disabled: true }],
      editedBy: [{ value: this.company.editedBy, disabled: true }],
    });
    this.viewCompanyForm.disable();
  }

  closeDialog(): void {
    this.dialogRef.close({ event: 'Cancel' });
  }
}

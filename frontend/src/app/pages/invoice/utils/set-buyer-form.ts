import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IBuyer } from '@interfaces';
import { IInvoice } from 'interfaces/invoice.interface';

export const setBuyerFormFunc = (
  buyer: IBuyer,
  fb: FormBuilder,
  currentInvoice: IInvoice
): FormGroup => {
  const buyerGroup = buyer.hasOwnProperty('CUI')
    ? fb.group({
        name: [buyer.name, [Validators.required]],
        J: [buyer.J, [Validators.required]],
        CUI: [buyer.CUI, [Validators.required]],
        headquarters: [buyer.headquarters, [Validators.required]],
        county: [buyer.county, [Validators.required]],
        bankAccount: [buyer.bankAccount],
        bank: [buyer.bank],
        _id: [currentInvoice ? currentInvoice.buyer._id : null],
      })
    : fb.group({
        name: [buyer.name, [Validators.required]],
        series: [buyer.series, [Validators.required]],
        CNP: [buyer.CNP, [Validators.required]],
        headquarters: [buyer.headquarters, [Validators.required]],
        county: [buyer.county, [Validators.required]],
        bankAccount: [buyer.bankAccount],
        bank: [buyer.bank],
        _id: [currentInvoice ? currentInvoice.buyer._id : null],
      });
  return buyerGroup;
};

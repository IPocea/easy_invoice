import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IBuyer, IInvoice } from '@interfaces';

export const setInvoiceFormFunc = (
  invoiceFormPrevValue: IInvoice,
  fb: FormBuilder,
  doesInvoiceBelongsToCompany: boolean,
  buyer: IBuyer
): FormGroup => {
  const invoiceGroup = doesInvoiceBelongsToCompany
    ? fb.group({
        typeOfInvoice: [
          invoiceFormPrevValue.typeOfInvoice,
          [Validators.required],
        ],
        series: [invoiceFormPrevValue.series, [Validators.required]],
        number: [invoiceFormPrevValue.number, [Validators.required]],
        date: [invoiceFormPrevValue.date, [Validators.required]],
        numberOfAccompanyingNotice: [
          invoiceFormPrevValue.numberOfAccompanyingNotice,
        ],
        isCancelled: [invoiceFormPrevValue.isCancelled],
        cancellationNotices: [invoiceFormPrevValue.cancellationNotices],
        borderColor: [invoiceFormPrevValue.borderColor],
        paymentStatus: [invoiceFormPrevValue.paymentStatus],
        companyId: [buyer._id, [Validators.required]],
        addedBy: [invoiceFormPrevValue.addedBy, [Validators.required]],
        editedBy: [invoiceFormPrevValue.editedBy],
      })
    : fb.group({
        typeOfInvoice: [
          invoiceFormPrevValue.typeOfInvoice,
          [Validators.required],
        ],
        series: [invoiceFormPrevValue.series, [Validators.required]],
        number: [invoiceFormPrevValue.number, [Validators.required]],
        date: [invoiceFormPrevValue.date, [Validators.required]],
        numberOfAccompanyingNotice: [
          invoiceFormPrevValue.numberOfAccompanyingNotice,
        ],
        isCancelled: [invoiceFormPrevValue.isCancelled],
        cancellationNotices: [invoiceFormPrevValue.cancellationNotices],
        borderColor: [invoiceFormPrevValue.borderColor],
        paymentStatus: [invoiceFormPrevValue.paymentStatus],
        individualId: [buyer._id, [Validators.required]],
        addedBy: [invoiceFormPrevValue.addedBy, [Validators.required]],
        editedBy: [invoiceFormPrevValue.editedBy],
      });
  return invoiceGroup;
};

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IContractModel, IMyCompany, IUser } from '@interfaces';
import { IInvoice } from 'interfaces/invoice.interface';

export const setFormFunc = (
  fb: FormBuilder,
  doesInvoiceBelongsToCompany: boolean,
  currentInvoice: IInvoice,
  selectedContractModel: IContractModel,
  currentUser: IUser,
  myCompany: IMyCompany,
  existingProducts: FormGroup[]
): FormGroup => {
  const formGroup = fb.group({
    invoice: doesInvoiceBelongsToCompany
      ? fb.group({
          typeOfInvoice: [
            currentInvoice ? currentInvoice.typeOfInvoice : null,
            [Validators.required],
          ],
          series: [
            currentInvoice ? currentInvoice.series : null,
            [Validators.required],
          ],
          number: [
            currentInvoice ? currentInvoice.number : null,
            [Validators.required],
          ],
          date: [
            currentInvoice ? new Date(currentInvoice.date) : new Date(),
            [Validators.required],
          ],
          numberOfAccompanyingNotice: [
            currentInvoice ? currentInvoice.numberOfAccompanyingNotice : null,
          ],
          isCancelled: [currentInvoice ? currentInvoice.isCancelled : false],
          cancellationNotices: [
            currentInvoice ? currentInvoice.cancellationNotices : null,
          ],
          borderColor: [
            currentInvoice ? currentInvoice.borderColor : '#0000FF',
          ],
          paymentStatus: [
            currentInvoice ? currentInvoice.paymentStatus : false,
          ],
          companyId: [currentInvoice ? currentInvoice.companyId : null],
          addedBy: [
            currentInvoice
              ? currentInvoice.addedBy
              : currentUser.firstName + ' ' + currentUser.lastName,
            [Validators.required],
          ],
          editedBy: [currentInvoice ? currentInvoice.editedBy : null],
        })
      : fb.group({
          typeOfInvoice: [
            currentInvoice ? currentInvoice.typeOfInvoice : null,
            [Validators.required],
          ],
          series: [
            currentInvoice ? currentInvoice.series : null,
            [Validators.required],
          ],
          number: [
            currentInvoice ? currentInvoice.number : null,
            [Validators.required],
          ],
          date: [
            currentInvoice ? currentInvoice.date : null,
            [Validators.required],
          ],
          numberOfAccompanyingNotice: [
            currentInvoice ? currentInvoice.numberOfAccompanyingNotice : null,
          ],
          isCancelled: [currentInvoice ? currentInvoice.isCancelled : false],
          cancellationNotices: [
            currentInvoice ? currentInvoice.cancellationNotices : null,
          ],
          borderColor: [
            currentInvoice ? currentInvoice.borderColor : '#0000FF',
          ],
          paymentStatus: [
            currentInvoice ? currentInvoice.paymentStatus : false,
          ],
          individualId: [
            currentInvoice ? currentInvoice.individualId : null,
            [Validators.required],
          ],
          addedBy: [
            currentInvoice
              ? currentInvoice.addedBy
              : currentUser.firstName + ' ' + currentUser.lastName,
            [Validators.required],
          ],
          editedBy: [currentInvoice ? currentInvoice.editedBy : null],
        }),
    buyer: doesInvoiceBelongsToCompany
      ? fb.group({
          name: [
            currentInvoice ? currentInvoice.buyer.name : null,
            [Validators.required],
          ],
          J: [
            currentInvoice ? currentInvoice.buyer.J : null,
            [Validators.required],
          ],
          CUI: [
            currentInvoice ? currentInvoice.buyer.CUI : null,
            [Validators.required],
          ],
          headquarters: [
            currentInvoice ? currentInvoice.buyer.headquarters : null,
            [Validators.required],
          ],
          county: [
            currentInvoice ? currentInvoice.buyer.county : null,
            [Validators.required],
          ],
          bankAccount: [
            currentInvoice ? currentInvoice.buyer.bankAccount : null,
          ],
          bank: [currentInvoice ? currentInvoice.buyer.bank : null],
          _id: [currentInvoice ? currentInvoice.buyer._id : null],
        })
      : fb.group({
          name: [
            currentInvoice ? currentInvoice.buyer.name : null,
            [Validators.required],
          ],
          series: [
            currentInvoice ? currentInvoice.buyer.series : null,
            [Validators.required],
          ],
          CNP: [
            currentInvoice ? currentInvoice.buyer.CNP : null,
            [Validators.required],
          ],
          headquarters: [
            currentInvoice ? currentInvoice.buyer.headquarters : null,
            [Validators.required],
          ],
          county: [
            currentInvoice ? currentInvoice.buyer.county : null,
            [Validators.required],
          ],
          bankAccount: [
            currentInvoice ? currentInvoice.buyer.bankAccount : null,
          ],
          bank: [currentInvoice ? currentInvoice.buyer.bank : null],
          _id: [currentInvoice ? currentInvoice.buyer._id : null],
        }),
    seller: fb.group({
      name: [myCompany.name, [Validators.required]],
      J: [myCompany.J, [Validators.required]],
      CUI: [myCompany.CUI, [Validators.required]],
      headquarters: [myCompany.headquarters, [Validators.required]],
      county: [myCompany.county, [Validators.required]],
      bankAccount: [myCompany.bankAccount],
      bank: [myCompany.bank],
      treasury: [myCompany.treasury],
      socialCapital: [myCompany.socialCapital],
      vatRate: [myCompany.vatRate, [Validators.required]],
      delegatesName: [myCompany.delegatesName],
      email: [myCompany.email],
      phone: [myCompany.phone],
      _id: [myCompany._id],
    }),
    contract: fb.group({
      number: [
        currentInvoice ? currentInvoice.contract.number : null,
        [Validators.required],
      ],
      subjectOfContract: [
        currentInvoice ? currentInvoice.contract.subjectOfContract : null,
        [Validators.required],
      ],
      paymentAdvance: [
        currentInvoice ? currentInvoice.contract.paymentAdvance : null,
      ],
      restOfPayment: [
        currentInvoice ? currentInvoice.contract.restOfPayment : null,
      ],
      transport: [currentInvoice ? currentInvoice.contract.transport : null],
      installation: [
        currentInvoice ? currentInvoice.contract.installation : null,
      ],
      paymentMethod: [
        currentInvoice ? currentInvoice.contract.paymentMethod : null,
      ],
      deliveryTime: [
        currentInvoice ? currentInvoice.contract.deliveryTime : null,
      ],
      content: [
        currentInvoice
          ? currentInvoice.contract.content
          : selectedContractModel.content,
      ],
      contractModel: [
        currentInvoice
          ? currentInvoice.contract.contractModel
          : selectedContractModel,
      ],
      addedBy: [
        currentInvoice
          ? currentInvoice.addedBy
          : currentUser.firstName + ' ' + currentUser.lastName,
        [Validators.required],
      ],
      editedBy: [currentInvoice ? currentInvoice.editedBy : null],
    }),
    products: fb.array(existingProducts, [Validators.required]),
  });
  return formGroup;
};

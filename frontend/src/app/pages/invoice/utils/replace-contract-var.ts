import { FormArray, FormGroup } from '@angular/forms';

export const replaceContractVarFunc = (
  variable: string,
  addEditInvoiceForm: FormGroup,
  newContractContent: string,
  doesInvoiceBelongsToCompany: boolean,
  products: FormArray,
  totalRate: number
): string => {
  const regExp = new RegExp(variable, 'gi');
  switch (variable.toLowerCase()) {
    case '{nume-furnizor}':
      const sellerName = addEditInvoiceForm.value.seller.name
        ? addEditInvoiceForm.value.seller.name
        : '';
      return newContractContent.replace(regExp, sellerName);
    case '{j-furnizor}':
      const sellerJ = addEditInvoiceForm.value.seller.J
        ? addEditInvoiceForm.value.seller.J
        : '';
      return newContractContent.replace(regExp, sellerJ);
    case '{cui-furnizor}':
      const sellerCUI = addEditInvoiceForm.value.seller.CUI
        ? addEditInvoiceForm.value.seller.CUI
        : '';
      return newContractContent.replace(regExp, sellerCUI);
    case '{sediu-furnizor}':
      const sellerHeadquarters = addEditInvoiceForm.value.seller.headquarters
        ? addEditInvoiceForm.value.seller.headquarters
        : '';
      return newContractContent.replace(regExp, sellerHeadquarters);
    case '{judet-furnizor}':
      const sellerCounty = addEditInvoiceForm.value.seller.county
        ? addEditInvoiceForm.value.seller.county
        : '';
      return newContractContent.replace(regExp, sellerCounty);
    case '{cont-bancar-furnizor}':
      const sellerBankAccount = addEditInvoiceForm.value.seller.bankAccount
        ? addEditInvoiceForm.value.seller.bankAccount
        : '';
      return newContractContent.replace(regExp, sellerBankAccount);
    case '{banca-furnizor}':
      const sellerBank = addEditInvoiceForm.value.seller.bank
        ? addEditInvoiceForm.value.seller.bank
        : '';
      return newContractContent.replace(regExp, sellerBank);
    case '{email-furnizor}':
      const sellerEmail = addEditInvoiceForm.value.seller.email
        ? addEditInvoiceForm.value.seller.email
        : '';
      return newContractContent.replace(regExp, sellerEmail);
    case '{telefon-furnizor}':
      const sellerPhone = addEditInvoiceForm.value.seller.phone
        ? addEditInvoiceForm.value.seller.phone
        : '';
      return newContractContent.replace(regExp, sellerPhone);
    case '{delegat-furnizor}':
      const sellerDelName = addEditInvoiceForm.value.seller.delegatesName
        ? addEditInvoiceForm.value.seller.delegatesName
        : '';
      return newContractContent.replace(regExp, sellerDelName);
    case '{nume-client}':
      const buyerName = addEditInvoiceForm.value.buyer.name
        ? addEditInvoiceForm.value.buyer.name
        : '';
      return newContractContent.replace(regExp, buyerName);
    case '{j/serie-client}':
      let JSeries = doesInvoiceBelongsToCompany
        ? addEditInvoiceForm.value.buyer.J
        : addEditInvoiceForm.value.buyer.series;
      JSeries = JSeries ? JSeries : '';
      return newContractContent.replace(regExp, JSeries);
    case '{cui/cnp-client}':
      let CUICNP = doesInvoiceBelongsToCompany
        ? addEditInvoiceForm.value.buyer.CUI
        : addEditInvoiceForm.value.buyer.CNP;
      CUICNP = CUICNP ? CUICNP : '';
      return newContractContent.replace(regExp, CUICNP);
    case '{sediu-client}':
      const buyerHeadquarter = addEditInvoiceForm.value.buyer.headquarters
        ? addEditInvoiceForm.value.buyer.headquarters
        : '';
      return newContractContent.replace(regExp, buyerHeadquarter);
    case '{judet-client}':
      const buyerCounty = addEditInvoiceForm.value.buyer.county
        ? addEditInvoiceForm.value.buyer.county
        : '';
      return newContractContent.replace(regExp, buyerCounty);
    case '{cont-bancar-client}':
      const buyerBankAccount = addEditInvoiceForm.value.buyer.bankAccount
        ? addEditInvoiceForm.value.buyer.bankAccount
        : '';
      return newContractContent.replace(regExp, buyerBankAccount);
    case '{banca-client}':
      const buyerBank = addEditInvoiceForm.value.buyer.bank
        ? addEditInvoiceForm.value.buyer.bank
        : '';
      return newContractContent.replace(regExp, buyerBank);
    case '{email-client}':
      const buyerEmail = addEditInvoiceForm.value.buyer.email
        ? addEditInvoiceForm.value.buyer.email
        : '';
      return newContractContent.replace(regExp, buyerEmail);
    case '{telefon-client}':
      const buyerPhone = addEditInvoiceForm.value.buyer.phone
        ? addEditInvoiceForm.value.buyer.phone
        : '';
      return newContractContent.replace(regExp, buyerPhone);
    case '{numar-contract}':
      const contractNumber = addEditInvoiceForm.value.contract.number
        ? addEditInvoiceForm.value.contract.number
        : '';
      return newContractContent.replace(regExp, contractNumber);
    case '{data-contract}':
      let contractDate = addEditInvoiceForm.value.invoice.date
        ? addEditInvoiceForm.value.invoice.date
        : '';
      if (contractDate) {
        const selectedDate = new Date(contractDate);
        const day =
          selectedDate.getDate() < 10
            ? '0' + selectedDate.getDate()
            : selectedDate.getDate();
        const month =
          selectedDate.getMonth() + 1 < 10
            ? '0' + (selectedDate.getMonth() + 1)
            : selectedDate.getMonth() + 1;
        const year = selectedDate.getFullYear();
        contractDate = `${day}.${month}.${year}`;
      }
      return newContractContent.replace(regExp, contractDate);
    case '{obiect-contract}':
      const contractSubjectOfContract = addEditInvoiceForm.value.contract
        .subjectOfContract
        ? addEditInvoiceForm.value.contract.subjectOfContract
        : '';
      return newContractContent.replace(regExp, contractSubjectOfContract);

    case '{produse-contract}':
      let productsNameList = '<ul>';
      for (let product of products.controls) {
        productsNameList += `<li>${product.value.name}</li>`;
      }
      productsNameList += '</ul>';
      return newContractContent.replace(regExp, productsNameList);
    case '{valoare-contract}':
      return newContractContent.replace(regExp, totalRate.toString());
    case '{avans-contract}':
      const contractPaymentAdvance = addEditInvoiceForm.value.contract
        .paymentAdvance
        ? addEditInvoiceForm.value.contract.paymentAdvance
        : '';
      return newContractContent.replace(regExp, contractPaymentAdvance);
    case '{rest-plata-contract}':
      const contractRestOfPayment = addEditInvoiceForm.value.contract
        .restOfPayment
        ? addEditInvoiceForm.value.contract.restOfPayment
        : '';
      return newContractContent.replace(regExp, contractRestOfPayment);
    case '{metoda-plata-contract}':
      const contractPaymentMethod = addEditInvoiceForm.value.contract
        .paymentMethod
        ? addEditInvoiceForm.value.contract.paymentMethod
        : '';
      return newContractContent.replace(regExp, contractPaymentMethod);
    case '{transport-contract}':
      const contractTransport = addEditInvoiceForm.value.contract.transport
        ? addEditInvoiceForm.value.contract.transport
        : '';
      return newContractContent.replace(regExp, contractTransport);
    case '{montaj-contract}':
      const contractInstallation = addEditInvoiceForm.value.contract
        .installation
        ? addEditInvoiceForm.value.contract.installation
        : '';
      return newContractContent.replace(regExp, contractInstallation);
    case '{termen-livrare-contract}':
      const contractDeliveryTime = addEditInvoiceForm.value.contract
        .deliveryTime
        ? addEditInvoiceForm.value.contract.deliveryTime
        : '';
      return newContractContent.replace(regExp, contractDeliveryTime);
    default:
      return newContractContent;
  }
};

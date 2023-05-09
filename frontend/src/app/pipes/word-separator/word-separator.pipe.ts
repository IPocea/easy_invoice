import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'wordSeparator',
})
export class WordSeparatorPipe implements PipeTransform {
  transform(value: string, arg: string = 'masculin'): string {
    const pattern = /[A-Z]/g;
    let newValue: string;
    if (pattern.test(value)) {
      newValue = value.split(/(?=[A-Z])/).join(' ');
      newValue = newValue.slice(0, 1).toUpperCase() + newValue.slice(1);
    } else {
      newValue = value.slice(0, 1).toUpperCase() + value.slice(1).toLowerCase();
    }
    if (arg === 'feminin') {
      newValue = newValue + ' F';
    }
    switch (newValue) {
      case 'Role':
        return 'Rol';
      case 'First Name':
        return 'Prenume';
      case 'Last Name':
        return 'Nume';
      case 'Is Activated':
        return 'Status';
      case 'Created At':
        return 'Creat la';
      case 'Created At F':
        return 'Creata la';
      case 'Updated At':
        return 'Actualizat la';
      case 'Updated At F':
        return 'Actualizata la';
      case 'Name':
        return 'Nume';
      case 'J':
        return 'Nr. de inmatriculare';
      case 'Headquarters':
        return 'Sediul';
      case 'County':
        return 'Judetul';
      case 'Vat Rate':
        return 'Cota TVA';
      case 'Bank Account':
        return 'Cont bancar';
      case 'Bank':
        return 'Banca';
      case 'Phone':
        return 'Nr. telefon';
      case 'Added By':
        return 'Adaugat de';
      case 'Edited By':
        return 'Editat de';
      case 'Added By F':
        return 'Adaugata de';
      case 'Edited By F':
        return 'Editata de';
      case 'Total Sum':
        return 'Plati de incasat';
      case 'Total Payment':
        return 'Plati incasate';
      case 'Total Payments':
        return 'Plati';
      case 'Payment Amount':
        return 'Valoare plata';
      case 'Total Cost':
        return 'Valoare totala';
      case 'Payment Status':
        return 'Status plata';
      case 'Type Of Invoice':
        return 'Tipul facturii';
      case 'Is Cancelled':
        return 'Status factura';
      case 'Date':
        return 'Data';
      case 'Series':
        return 'Serie';
      case 'Number':
        return 'Numar';
      case 'Buyer':
        return 'Cumparator';
      case 'Contract Number':
        return 'Numar contract';
      case 'Invoice Number':
        return 'Numar factura';
      case 'C N P':
        return 'CNP';
      case 'C U I':
        return 'CUI';
      case 'C U I/ C N P':
        return 'CUI/CNP';
      case 'Invoice.total Cost':
        return 'Valoare totala';
      case 'Invoice.date':
        return 'Data';
      case 'Invoice.buyer.name':
        return 'Cumparator';  
      default:
        return newValue;
    }
  }
}

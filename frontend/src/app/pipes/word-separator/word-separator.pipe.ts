import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'wordSeparator',
})
export class WordSeparatorPipe implements PipeTransform {
  transform(value: string): string {
    const pattern = /[A-Z]/g;
    let newValue: string;
    if (pattern.test(value)) {
      newValue = value.split(/(?=[A-Z])/).join(' ');
      newValue = newValue.slice(0, 1).toUpperCase() + newValue.slice(1);
    } else {
      newValue = value.slice(0, 1).toUpperCase() + value.slice(1).toLowerCase();
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
      case 'Updated At':
        return 'Actualizat la';
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
      case 'Total Sum':
        return 'Plati de incasat';
      case 'Total Payments':
        return 'Plati incasate';
      case 'Payment Amount':
        return 'Valoare plata';  
      default:
        return newValue;
    }
  }
}

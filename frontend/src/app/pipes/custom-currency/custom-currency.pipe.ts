import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'customCurrency',
})
export class CustomCurrencyPipe implements PipeTransform {
  transform(value: string): string {
    return value ? (+value).toFixed(2) + ' RON' : '0 RON';
  }
}

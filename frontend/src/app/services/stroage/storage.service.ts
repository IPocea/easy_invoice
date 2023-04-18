import { Injectable } from '@angular/core';
import { ITokens } from '@interfaces';

const ACCESS_TOKEN = 'accessToken';
const REFRESH_TOKEN = 'refreshToken';
@Injectable({
  providedIn: 'root',
})
export class StorageService {
  constructor() {}

  getItem(item: string): object | string {
    const storage: object = JSON.parse(localStorage.getItem('easyInvoiceApp')) || {};
    return storage[item];
  };
  
  setItem(item: string, newValue: object | string): void {
    const storage: object = JSON.parse(localStorage.getItem('easyInvoiceApp')) || {};
    storage[item] = newValue;
    const newStorage: string = JSON.stringify(storage);
    localStorage.setItem('easyInvoiceApp', newStorage);
  };
  
  removeItem(item: string): void {
    const storage: object = JSON.parse(localStorage.getItem('easyInvoiceApp')) || {};
    delete storage[item];
    const newStorage: string = JSON.stringify(storage);
    localStorage.setItem('easyInvoiceApp', newStorage);
  };

  // saveTokens(tokens: ITokens): void {
  //   this.clearTokens();
  //   window.localStorage.setItem(
  //     ACCESS_TOKEN,
  //     JSON.stringify(tokens.accessToken)
  //   );
  //   window.localStorage.setItem(
  //     REFRESH_TOKEN,
  //     JSON.stringify(tokens.refreshToken)
  //   );
  // }

  // getTokens(): ITokens | null {
  //   const accessToken = window.localStorage.getItem(ACCESS_TOKEN);
  //   const refreshToken = window.localStorage.getItem(REFRESH_TOKEN);
  //   if (!accessToken || !refreshToken) {
  //     return null;
  //   }
  //   const tokens: ITokens = {
  //     accessToken: JSON.parse(accessToken),
  //     refreshToken: JSON.parse(refreshToken),
  //   };
  //   return tokens;
  // }

  // clearTokens(): void {
  //   window.localStorage.removeItem(ACCESS_TOKEN);
  //   window.localStorage.removeItem(REFRESH_TOKEN);
  // }
}

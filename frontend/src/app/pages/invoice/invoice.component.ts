import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import {
  IBuyer,
  IContractModel,
  IHistoryAction,
  IMyCompany,
  IProduct,
  ITokens,
  IUser,
} from '@interfaces';
import {
  ContractModelService,
  ContractService,
  HistoryService,
  InvoiceService,
  LoginDataService,
  MyCompanyService,
  NotificationService,
  ProductService,
  StorageService,
  TokenService,
} from '@services';
import { quillBasicModule } from '@utils/quill-module';
import { IInvoice } from 'interfaces/invoice.interface';
import Quill from 'quill';
import { finalize, take } from 'rxjs';
import { AddChangeBuyerComponent } from './components/add-change-buyer/add-change-buyer.component';
import { SelectContractModelComponent } from './components/select-contract-model/select-contract-model.component';
import { ConfirmationDialogComponent } from '@shared/components/confirmation-dialog/confirmation-dialog.component';
import {
  add,
  cleanForm,
  divide,
  findInvalidControls,
  multiply,
  substract,
} from '@utils/index';
import { environment } from '../../../environments/environment';
import {
  replaceContractVarFunc,
  setBuyerFormFunc,
  setFormFunc,
  setInvoiceFormFunc,
} from './utils';
import { HttpErrorResponse } from '@angular/common/http';

class PreserveWhiteSpace {
  constructor(private quill: any, private options: {}) {
    quill.container.style.whiteSpace = 'pre-line';
  }
}

Quill.register('modules/preserveWhiteSpace', PreserveWhiteSpace);

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.scss'],
})
export class InvoiceComponent implements OnInit {
  myCompany: IMyCompany = null;
  addEditInvoiceForm: FormGroup;
  isLoading: boolean = true;
  isAddingEditing: boolean = false;
  addEditInvoiceBtnMessage: string = '';
  doesInvoiceBelongsToCompany: boolean = true;
  selectedContractModel: IContractModel = null;
  contractModels: IContractModel[] = [];
  currentInvoice: IInvoice = null;
  currentUser: IUser = null;
  addChangeBuyerRef: MatDialogRef<AddChangeBuyerComponent>;
  selectContractModelRef: MatDialogRef<SelectContractModelComponent>;
  confirmDialogRef: MatDialogRef<ConfirmationDialogComponent>;
  quillModules = quillBasicModule;
  totalRate: number = 0;
  totalVatRate: number = 0;
  historyActions: IHistoryAction[] = [];

  constructor(
    public dialog: MatDialog,
    private contractModelService: ContractModelService,
    private myCompanyService: MyCompanyService,
    private invoiceService: InvoiceService,
    private storageService: StorageService,
    private loginDataService: LoginDataService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private notificationService: NotificationService,
    private productService: ProductService,
    private tokenService: TokenService,
    private contractService: ContractService,
    private historyService: HistoryService
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.currentUser = this.loginDataService.getLoggedUser();
    this.getParams();
  }

  addEditInvoice(): void {
    this.replaceContractVars();
    this.cleanAllForms();
    if (this.currentInvoice) {
      this.updateInvoice();
    } else {
      this.createInvoice();
    }
  }

  addPayment(): void {

  }

  deletePayment(): void {
    
  }

  addProduct(): void {
    this.products.push(this.createProduct());
  }

  get products(): FormArray {
    return <FormArray>this.addEditInvoiceForm.get('products');
  }

  deleteProduct(product: IProduct, index: number): void {
    this.isAddingEditing = true;
    if (product._id) {
      this.confirmDialogRef = this.dialog.open(ConfirmationDialogComponent, {
        disableClose: true,
      });
      this.confirmDialogRef.componentInstance.title = 'Sterge produs';
      this.confirmDialogRef.componentInstance.content =
        'Esti sigur ca iti doresti sa stergi acest produs? Produsul va fi sters definitiv de pe factura';
      this.confirmDialogRef.afterClosed().subscribe((res) => {
        if (res) {
          this.removeProduct(product._id);
        } else {
          this.isAddingEditing = false;
        }
      });
    } else {
      this.products.controls.splice(index, 1);
      this.adjustTotalRates();
      const invalid = findInvalidControls(this.products as FormArray);
      if (!invalid.length) {
        this.addEditInvoiceForm.controls['products'].markAsPristine();
        this.addEditInvoiceForm.controls['products'].updateValueAndValidity();
      }
      this.isAddingEditing = false;
    }
  }

  addChangeBuyer(): void {
    this.addChangeBuyerRef = this.dialog.open(AddChangeBuyerComponent, {
      disableClose: true,
    });
    this.addChangeBuyerRef.componentInstance.currentUser = this.currentUser;
    this.addChangeBuyerRef.afterClosed().subscribe((res) => {
      if (res?.event === 'Send Buyer') {
        this.setBuyerForm(res.buyer);
        console.log(this.addEditInvoiceForm.value.invoice);
        this.setInvoiceForm(res.buyer);
        console.log(this.addEditInvoiceForm.value);
      }
    });
  }

  selectContractModel(): void {
    this.selectContractModelRef = this.dialog.open(
      SelectContractModelComponent,
      {
        disableClose: true,
      }
    );
    this.selectContractModelRef.afterClosed().subscribe((res) => {
      if (res.event === 'Send Contract Model') {
        this.selectedContractModel = res.contractModel;
        this.addEditInvoiceForm.controls['contract'].patchValue({
          contractModel: this.selectedContractModel,
        });
        console.log(this.addEditInvoiceForm.value);
      }
    });
  }

  handleProductInputs(control: string, index: number): void {
    this.isAddingEditing = true;
    this.handleDecimals(control, index);
    this.adjustTotalRatesSetTimeout();
  }

  viewContract(): void {
    this.isAddingEditing = true;
    this.refreshToken('contract');
  }

  viewInvoice(): void {
    this.isAddingEditing = true;
    this.refreshToken('invoice');
  }

  viewHistory(): void {
    this.isAddingEditing = true;
    this.getHistoryActions();
  }

  private handleDecimals(control: string, i: number): void {
    const value = this.products.controls[i].value[control];
    if (!value) return;
    let stringifyNum = value.toString();
    if (
      stringifyNum.includes('.') &&
      stringifyNum.indexOf('.') === stringifyNum.lastIndexOf('.')
    ) {
      this.products.controls[i].patchValue({
        [control]: +stringifyNum.slice(0, stringifyNum.indexOf('.') + 3),
      });
    } else if (
      stringifyNum.includes('.') &&
      stringifyNum.indexOf('.') !== stringifyNum.lastIndexOf('.')
    ) {
      this.products.controls[i].patchValue({
        [control]: +stringifyNum
          .replace('.', '!')
          .replace(/./g, '')
          .replace('!', '.'),
      });
    } else {
      return;
    }
  }

  private adjustTotalRatesSetTimeout(): void {
    setTimeout(() => {
      this.adjustTotalRates();
    }, 100);
  }

  private adjustTotalRates(): void {
    let total: number = 0;
    let totalVat: number = 0;
    for (let i = 0; i < this.products.controls.length; i++) {
      const product = this.products.controls[i];
      const actualTotal: number = multiply(
        product.value.quantity,
        product.value.unitPrice
      );
      let actualVatRate = divide(
        multiply(actualTotal, 100),
        add(100, product.value.VAT)
      );
      actualVatRate = substract(actualTotal, actualVatRate);
      total = add(total, actualTotal);
      totalVat = add(totalVat, actualVatRate);
    }
    this.totalRate = total;
    this.totalVatRate = totalVat;
    this.isAddingEditing = false;
  }

  private getMyCompany(params: string): void {
    this.myCompanyService
      .getMyCompany()
      .pipe(take(1))
      .subscribe({
        next: (myCompany) => {
          this.myCompany = myCompany[0];
          if (params.toLowerCase() === 'adauga') {
            this.currentInvoice = null;
            this.historyActions = [];
            this.getContractModels();
          } else {
            this.getInvoice(params);
          }
        },
        error: (err) => {
          this.notificationService.error(
            'O eroare neprevazuta a avut loc. Te rugam sa incerci din nou'
          );
          this.router.navigate(['bine-ai-venit']);
        },
      });
  }

  private getParams(): void {
    this.route.params.subscribe((params) => {
      this.getMyCompany(params['id']);
    });
  }

  private getContractModels(): void {
    const selectedContractModelId = this.storageService.getItem(
      'selectedContractModelId'
    );
    this.contractModelService
      .getContractModels(null)
      .pipe(
        take(1),
        finalize(() => {
          this.addEditInvoiceBtnMessage = this.currentInvoice
            ? 'Editeaza factura'
            : 'Adauga factura';
          this.adjustTotalRates();
          this.isLoading = false;
        })
      )
      .subscribe({
        next: (contractModels) => {
          if (contractModels.length) {
            this.contractModels = contractModels;
            if (this.currentInvoice) {
              this.selectedContractModel =
                this.currentInvoice.contract.contractModel;
            } else {
              this.selectedContractModel = this.contractModels.find(
                (model) => model._id === selectedContractModelId
              );
              if (!this.selectedContractModel) {
                this.selectedContractModel = this.contractModels[0];
              }
            }
            this.setForm();
          } else {
            this.notificationService.error(
              'Nu exista niciun model de contract. Te rugam sa creezi intai unul si apoi sa revii la factura'
            );
            this.router.navigate(['modele-contract']);
          }
        },
        error: (err) => {
          this.notificationService.error(
            'O eroare neprevazuta a avut loc. Te rugam sa te asiguri ca ai un model de contract salvat'
          );
          this.router.navigate(['modele-contract']);
        },
      });
  }

  private getInvoice(invoiceId: string): void {
    this.invoiceService
      .getOne(invoiceId)
      .pipe(
        take(1),
        finalize(() => {
          this.getContractModels();
        })
      )
      .subscribe({
        next: (invoice) => {
          this.currentInvoice = invoice;
          console.log(this.currentInvoice);
          if (this.currentInvoice.buyer.CUI) {
            this.doesInvoiceBelongsToCompany = true;
          } else {
            this.doesInvoiceBelongsToCompany = false;
          }
        },
        error: (err) => {
          this.notificationService.error(err.error.message);
          if (
            err.error.message.startsWith('Nu am putut gasi factura cu id-ul')
          ) {
            this.router.navigate(['factura/adauga']);
          }
        },
      });
  }

  private createProduct(): FormGroup {
    return this.fb.group({
      name: [null, [Validators.required]],
      quantity: [0, [Validators.required]],
      unitPrice: [0, [Validators.required]],
      VAT: [this.myCompany.vatRate, [Validators.required]],
      UM: [null],
      _id: [null],
    });
  }

  private getExistingProducts(products: IProduct[]): FormGroup[] {
    const result: FormGroup[] = [];
    if (products && products.length) {
      for (const product of products) {
        result.push(
          this.fb.group({
            name: [product.name, [Validators.required]],
            quantity: [product.quantity, [Validators.required]],
            unitPrice: [product.unitPrice, [Validators.required]],
            VAT: [product.VAT, [Validators.required]],
            UM: [product.UM ? product.UM : null],
            _id: [product._id, [Validators.required]],
          })
        );
      }
    } else {
      result.push(this.createProduct());
    }
    return result;
  }

  private removeProduct(productId: string): void {
    this.productService
      .deleteOne(productId)
      .pipe(take(1))
      .subscribe({
        next: (res) => {
          this.getRemainingProducts(this.currentInvoice._id);
        },
        error: (err) => {
          this.notificationService.error(err.error.message);
          this.isAddingEditing = false;
        },
      });
  }

  private getRemainingProducts(invoiceId: string): void {
    this.productService
      .getAllOfInvoice(invoiceId)
      .pipe(
        take(1),
        finalize(() => {
          this.isAddingEditing = false;
          this.adjustTotalRates();
        })
      )
      .subscribe({
        next: (products) => {
          const remainingProducts = this.getExistingProducts(products);
          this.products.controls = remainingProducts;
        },
        error: (err) => {},
      });
  }

  private replaceContractVars(): void {
    let newContractContent = this.selectedContractModel.content;
    for (let variable of environment.contractModels.acceptedFields) {
      newContractContent = this.replaceContractVar(
        variable,
        newContractContent
      );
    }
    this.addEditInvoiceForm.controls['contract'].patchValue({
      content: newContractContent,
    });
  }

  private replaceContractVar(
    variable: string,
    newContractContent: string
  ): string {
    return replaceContractVarFunc(
      variable,
      this.addEditInvoiceForm,
      newContractContent,
      this.doesInvoiceBelongsToCompany,
      this.products,
      this.totalRate
    );
  }

  private setForm(): void {
    const existingProducts: FormGroup[] = this.getExistingProducts(
      this.currentInvoice ? this.currentInvoice.products : []
    );
    this.addEditInvoiceForm = setFormFunc(
      this.fb,
      this.doesInvoiceBelongsToCompany,
      this.currentInvoice,
      this.selectedContractModel,
      this.currentUser,
      this.myCompany,
      existingProducts
    );
    console.log(this.addEditInvoiceForm.value);
  }

  private setBuyerForm(buyer: IBuyer): void {
    // first save the buyerGroup into a variable
    const buyerGroup = setBuyerFormFunc(buyer, this.fb, this.currentInvoice);
    // change the buyer grup
    this.addEditInvoiceForm.controls['buyer'] = buyerGroup;
    // change the values of buyer to buyerGroup.value
    this.addEditInvoiceForm.patchValue({ buyer: buyerGroup.value });
    this.doesInvoiceBelongsToCompany = this.addEditInvoiceForm.value.buyer.CUI
      ? true
      : false;
  }

  private createInvoice(): void {
    this.invoiceService
      .create(this.addEditInvoiceForm.value)
      .pipe(
        take(1),
        finalize(() => {
          this.isAddingEditing = false;
        })
      )
      .subscribe({
        next: (invoice) => {
          this.notificationService.info('Factura a fost adaugata cu succes');
          this.router.navigate(['factura', invoice._id]);
        },
        error: (err) => {
          this.notificationService.error(err.error.message);
        },
      });
  }

  private updateInvoice(): void {
    this.invoiceService
      .update(this.addEditInvoiceForm.value, this.currentInvoice._id)
      .pipe(
        take(1),
        finalize(() => {
          this.isAddingEditing = false;
        })
      )
      .subscribe({
        next: (invoice) => {
          this.notificationService.info('Factura a fost modificata cu succes');
          this.router.navigate(['factura', invoice._id]);
        },
        error: (err) => {
          this.notificationService.error(err.error.message);
        },
      });
  }

  private cleanAllForms(): void {
    const controls = this.addEditInvoiceForm.controls;
    for (const name in controls) {
      if (name !== 'products') {
        cleanForm(controls[name] as FormGroup);
      } else {
        for (const productForm of this.products.controls) {
          cleanForm(productForm as FormGroup);
        }
      }
    }
  }

  private setInvoiceForm(buyer: IBuyer): void {
    const invoiceGroup = setInvoiceFormFunc(
      this.addEditInvoiceForm.value.invoice,
      this.fb,
      this.doesInvoiceBelongsToCompany,
      buyer
    );
    this.addEditInvoiceForm.setControl('invoice', invoiceGroup);
  }

  private generateContractPdf(): void {
    this.contractService
      .getContractAsPdf(this.currentInvoice?.contract._id)
      .pipe(
        take(1),
        finalize(() => {
          this.isAddingEditing = false;
        })
      )
      .subscribe({
        next: (data: Blob) => {
          const file = new Blob([data], { type: 'application/pdf' });
          const fileURL = URL.createObjectURL(file);
          window.open(fileURL, '_blank');
        },
        error: (err) => {},
      });
  }

  private generateInvoicePdf(): void {
    this.invoiceService
      .getInvoiceAsPdf(this.currentInvoice?._id)
      .pipe(
        take(1),
        finalize(() => {
          this.isAddingEditing = false;
        })
      )
      .subscribe({
        next: (data: Blob) => {
          const file = new Blob([data], { type: 'application/pdf' });
          const fileURL = URL.createObjectURL(file);
          window.open(fileURL, '_blank');
        },
        error: (err) => {},
      });
  }

  private refreshToken(documentType: string): void {
    const tokens: ITokens = this.storageService.getItem('tokens') as ITokens;
    this.tokenService
      .useRefreshToken(tokens.refreshToken)
      .pipe(take(1))
      .subscribe({
        next: (tokens) => {
          this.storageService.setItem('tokens', tokens);
          if (documentType === 'contract') {
            this.generateContractPdf();
          } else if (documentType === 'invoice') {
            this.generateInvoicePdf();
          }
        },
        error: (err) => {
          if (
            err instanceof HttpErrorResponse &&
            err.status === 498 &&
            (err.error.error === 'Tokenul refresh a expirat' ||
              err.error.error === 'Acces interzis')
          ) {
            this.storageService.removeItem('tokens');
            this.loginDataService.setNextLoggedUser(null);
            this.router.navigate(['/login']);
            this.notificationService.error(
              err.error.error + '. Te rugam sa te loghezi'
            );
          }
          this.isLoading = false;
        },
      });
  }

  private getHistoryActions(): void {
    this.historyService
      .getAllOfInvoice(this.currentInvoice._id)
      .pipe(
        take(1),
        finalize(() => {
          this.isAddingEditing = false;
        })
      )
      .subscribe({
        next: (historyActions) => {
          this.historyActions = historyActions;
          // to do: open a dialog sending historyActions and display them in that dialog
          console.log(this.historyActions);
        },
        error: (err) => {
          this.notificationService.error(err.error.message);
        },
      });
  }
}

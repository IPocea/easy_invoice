import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import {
  IBuyer,
  IContractModel,
  IMyCompany,
  IProduct,
  IStatusChoices,
  IUser,
} from '@interfaces';
import {
  ContractModelService,
  InvoiceService,
  LoginDataService,
  MyCompanyService,
  NotificationService,
  ProductService,
  StorageService,
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
  divide,
  findInvalidControls,
  multiply,
  substract,
} from '@utils/index';
import { environment } from '../../../environments/environment';

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
  newContractContent: string = '';
  contractModels: IContractModel[] = [];
  currentInvoice: IInvoice = null;
  currentUser: IUser = null;
  addChangeBuyerRef: MatDialogRef<AddChangeBuyerComponent>;
  selectContractModelRef: MatDialogRef<SelectContractModelComponent>;
  confirmDialogRef: MatDialogRef<ConfirmationDialogComponent>;
  quillModules = quillBasicModule;
  totalRate: number = 0;
  totalVatRate: number = 0;

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
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.loginDataService.getLoggedUser();
    this.getMyCompany();
  }

  addEditInvoice(): void {
    this.replaceContractVars();
    console.log(this.addEditInvoiceForm.value);
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
        }
      });
    } else {
      this.products.controls.splice(index, 1);
      this.adjustTotalRates();
      const invalid = findInvalidControls(this.products as FormArray);
      console.log(invalid);
      if (!invalid.length) {
        console.log(1);

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

  private getMyCompany(): void {
    this.myCompanyService
      .getMyCompany()
      .pipe(take(1))
      .subscribe({
        next: (myCompany) => {
          this.myCompany = myCompany[0];
          this.getParams();
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
      if (params['id'].toLowerCase() === 'adauga') {
        this.getContractModels();
      } else {
        this.getInvoice(params['id']);
      }
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
        },
        error: (err) => {
          this.notificationService.error(err.error.message);
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

  private getExistingProducts(products: IProduct[]): any {
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
    this.newContractContent = this.selectedContractModel.content;
    for (let variable of environment.contractModels.acceptedFields) {
      this.replaceContractVar(variable);
    }
    this.addEditInvoiceForm.controls['contract'].patchValue({
      content: this.newContractContent,
    });
  }

  private replaceContractVar(variable: string): void {
    const regExp = new RegExp(variable, 'gi');
    switch (variable.toLowerCase()) {
      case '{nume-furnizor}':
        const sellerName = this.addEditInvoiceForm.value.seller.name
          ? this.addEditInvoiceForm.value.seller.name
          : '';
        this.newContractContent = this.newContractContent.replace(
          regExp,
          sellerName
        );
        break;
      case '{j-furnizor}':
        const sellerJ = this.addEditInvoiceForm.value.seller.J
          ? this.addEditInvoiceForm.value.seller.J
          : '';
        this.newContractContent = this.newContractContent.replace(
          regExp,
          sellerJ
        );
        break;
      case '{cui-furnizor}':
        const sellerCUI = this.addEditInvoiceForm.value.seller.CUI
          ? this.addEditInvoiceForm.value.seller.CUI
          : '';
        this.newContractContent = this.newContractContent.replace(
          regExp,
          sellerCUI
        );
        break;
      case '{sediu-furnizor}':
        const sellerHeadquarters = this.addEditInvoiceForm.value.seller
          .headquarters
          ? this.addEditInvoiceForm.value.seller.headquarters
          : '';
        this.newContractContent = this.newContractContent.replace(
          regExp,
          sellerHeadquarters
        );
        break;
      case '{judet-furnizor}':
        const sellerCounty = this.addEditInvoiceForm.value.seller.county
          ? this.addEditInvoiceForm.value.seller.county
          : '';
        this.newContractContent = this.newContractContent.replace(
          regExp,
          sellerCounty
        );
        break;
      case '{cont-bancar-furnizor}':
        const sellerBankAccount = this.addEditInvoiceForm.value.seller
          .bankAccount
          ? this.addEditInvoiceForm.value.seller.bankAccount
          : '';
        this.newContractContent = this.newContractContent.replace(
          regExp,
          sellerBankAccount
        );
        break;
      case '{banca-furnizor}':
        const sellerBank = this.addEditInvoiceForm.value.seller.bank
          ? this.addEditInvoiceForm.value.seller.bank
          : '';
        this.newContractContent = this.newContractContent.replace(
          regExp,
          sellerBank
        );
        break;
      case '{email-furnizor}':
        const sellerEmail = this.addEditInvoiceForm.value.seller.email
          ? this.addEditInvoiceForm.value.seller.email
          : '';
        this.newContractContent = this.newContractContent.replace(
          regExp,
          sellerEmail
        );
        break;
      case '{telefon-furnizor}':
        const sellerPhone = this.addEditInvoiceForm.value.seller.phone
          ? this.addEditInvoiceForm.value.seller.phone
          : '';
        this.newContractContent = this.newContractContent.replace(
          regExp,
          sellerPhone
        );
        break;
      case '{delegat-furnizor}':
        const sellerDelName = this.addEditInvoiceForm.value.seller.delegatesName
          ? this.addEditInvoiceForm.value.seller.delegatesName
          : '';
        this.newContractContent = this.newContractContent.replace(
          regExp,
          sellerDelName
        );
        break;
      case '{nume-client}':
        const buyerName = this.addEditInvoiceForm.value.buyer.name
          ? this.addEditInvoiceForm.value.buyer.name
          : '';
        this.newContractContent = this.newContractContent.replace(
          regExp,
          buyerName
        );
        break;
      case '{j/serie-client}':
        let JSeries = this.doesInvoiceBelongsToCompany
          ? this.addEditInvoiceForm.value.buyer.J
          : this.addEditInvoiceForm.value.buyer.series;
        JSeries = JSeries ? JSeries : '';
        this.newContractContent = this.newContractContent.replace(
          regExp,
          JSeries
        );
        break;
      case '{cui/cnp-client}':
        let CUICNP = this.doesInvoiceBelongsToCompany
          ? this.addEditInvoiceForm.value.buyer.CUI
          : this.addEditInvoiceForm.value.buyer.CNP;
        CUICNP = CUICNP ? CUICNP : '';
        this.newContractContent = this.newContractContent.replace(
          regExp,
          CUICNP
        );
        break;
      case '{sediu-client}':
        const buyerHeadquarter = this.addEditInvoiceForm.value.buyer
          .headquarters
          ? this.addEditInvoiceForm.value.buyer.headquarters
          : '';
        this.newContractContent = this.newContractContent.replace(
          regExp,
          buyerHeadquarter
        );
        break;
      case '{judet-client}':
        const buyerCounty = this.addEditInvoiceForm.value.buyer.county
          ? this.addEditInvoiceForm.value.buyer.county
          : '';
        this.newContractContent = this.newContractContent.replace(
          regExp,
          buyerCounty
        );
        break;
      case '{cont-bancar-client}':
        const buyerBankAccount = this.addEditInvoiceForm.value.buyer.bankAccount
          ? this.addEditInvoiceForm.value.buyer.bankAccount
          : '';
        this.newContractContent = this.newContractContent.replace(
          regExp,
          buyerBankAccount
        );
        break;
      case '{banca-client}':
        const buyerBank = this.addEditInvoiceForm.value.buyer.bank
          ? this.addEditInvoiceForm.value.buyer.bank
          : '';
        this.newContractContent = this.newContractContent.replace(
          regExp,
          buyerBank
        );
        break;
      case '{email-client}':
        const buyerEmail = this.addEditInvoiceForm.value.buyer.email
          ? this.addEditInvoiceForm.value.buyer.email
          : '';
        this.newContractContent = this.newContractContent.replace(
          regExp,
          buyerEmail
        );
        break;
      case '{telefon-client}':
        const buyerPhone = this.addEditInvoiceForm.value.buyer.phone
          ? this.addEditInvoiceForm.value.buyer.phone
          : '';
        this.newContractContent = this.newContractContent.replace(
          regExp,
          buyerPhone
        );
        break;
      case '{numar-contract}':
        const contractNumber = this.addEditInvoiceForm.value.contract.number
          ? this.addEditInvoiceForm.value.contract.number
          : '';
        this.newContractContent = this.newContractContent.replace(
          regExp,
          contractNumber
        );
        break;
      case '{data-contract}':
        let contractDate = this.addEditInvoiceForm.value.invoice.date
          ? this.addEditInvoiceForm.value.invoice.date
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
        this.newContractContent = this.newContractContent.replace(
          regExp,
          contractDate
        );
        break;
      case '{obiect-contract}':
        const contractSubjectOfContract = this.addEditInvoiceForm.value.contract
          .subjectOfContract
          ? this.addEditInvoiceForm.value.contract.subjectOfContract
          : '';
        this.newContractContent = this.newContractContent.replace(
          regExp,
          contractSubjectOfContract
        );
        break;
      case '{produse-contract}':
        let productsNameList = '<ul>';
        for (let product of this.products.controls) {
          productsNameList += `<li>${product.value.name}</li>`;
        }
        productsNameList += '</ul>';
        this.newContractContent = this.newContractContent.replace(
          regExp,
          productsNameList
        );
        break;
      case '{valoare-contract}':
        this.newContractContent = this.newContractContent.replace(
          regExp,
          this.totalRate.toString()
        );
        break;
      case '{avans-contract}':
        const contractPaymentAdvance = this.addEditInvoiceForm.value.contract
          .paymentAdvance
          ? this.addEditInvoiceForm.value.contract.paymentAdvance
          : '';
        this.newContractContent = this.newContractContent.replace(
          regExp,
          contractPaymentAdvance
        );
        break;
      case '{rest-plata-contract}':
        const contractRestOfPayment = this.addEditInvoiceForm.value.contract
          .restOfPayment
          ? this.addEditInvoiceForm.value.contract.restOfPayment
          : '';
        this.newContractContent = this.newContractContent.replace(
          regExp,
          contractRestOfPayment
        );
        break;
      case '{metoda-plata-contract}':
        const contractPaymentMethod = this.addEditInvoiceForm.value.contract
          .paymentMethod
          ? this.addEditInvoiceForm.value.contract.paymentMethod
          : '';
        this.newContractContent = this.newContractContent.replace(
          regExp,
          contractPaymentMethod
        );
        break;
      case '{transport-contract}':
        const contractTransport = this.addEditInvoiceForm.value.contract
          .transport
          ? this.addEditInvoiceForm.value.contract.transport
          : '';
        this.newContractContent = this.newContractContent.replace(
          regExp,
          contractTransport
        );
        break;
      case '{montaj-contract}':
        const contractInstallation = this.addEditInvoiceForm.value.contract
          .installation
          ? this.addEditInvoiceForm.value.contract.installation
          : '';
        this.newContractContent = this.newContractContent.replace(
          regExp,
          contractInstallation
        );
        break;
      case '{termen-livrare-contract}':
        const contractDeliveryTime = this.addEditInvoiceForm.value.contract
          .deliveryTime
          ? this.addEditInvoiceForm.value.contract.deliveryTime
          : '';
        this.newContractContent = this.newContractContent.replace(
          regExp,
          contractDeliveryTime
        );
        break;
      default:
        break;
    }
  }

  private setForm(): void {
    this.addEditInvoiceForm = this.fb.group({
      invoice: this.doesInvoiceBelongsToCompany
        ? this.fb.group({
            typeOfInvoice: [
              this.currentInvoice ? this.currentInvoice.typeOfInvoice : null,
              [Validators.required],
            ],
            series: [
              this.currentInvoice ? this.currentInvoice.series : null,
              [Validators.required],
            ],
            number: [
              this.currentInvoice ? this.currentInvoice.number : null,
              [Validators.required],
            ],
            date: [
              this.currentInvoice
                ? new Date(this.currentInvoice.date)
                : new Date(),
              [Validators.required],
            ],
            numberOfAccompanyingNotice: [
              this.currentInvoice
                ? this.currentInvoice.numberOfAccompanyingNotice
                : null,
            ],
            isCancelled: [
              this.currentInvoice ? this.currentInvoice.isCancelled : false,
            ],
            cancellationNotices: [
              this.currentInvoice
                ? this.currentInvoice.cancellationNotices
                : null,
            ],
            borderColor: [
              this.currentInvoice ? this.currentInvoice.borderColor : '#0000FF',
            ],
            paymentStatus: [
              this.currentInvoice ? this.currentInvoice.paymentStatus : false,
            ],
            companyId: [
              this.currentInvoice ? this.currentInvoice.companyId : null,
            ],
            addedBy: [
              this.currentInvoice
                ? this.currentInvoice.addedBy
                : this.currentUser.firstName + ' ' + this.currentUser.lastName,
              [Validators.required],
            ],
            editedBy: [
              this.currentInvoice ? this.currentInvoice.editedBy : null,
            ],
          })
        : this.fb.group({
            typeOfInvoice: [
              this.currentInvoice ? this.currentInvoice.typeOfInvoice : null,
              [Validators.required],
            ],
            series: [
              this.currentInvoice ? this.currentInvoice.series : null,
              [Validators.required],
            ],
            number: [
              this.currentInvoice ? this.currentInvoice.number : null,
              [Validators.required],
            ],
            date: [
              this.currentInvoice ? this.currentInvoice.date : null,
              [Validators.required],
            ],
            numberOfAccompanyingNotice: [
              this.currentInvoice
                ? this.currentInvoice.numberOfAccompanyingNotice
                : null,
            ],
            isCancelled: [
              this.currentInvoice ? this.currentInvoice.isCancelled : false,
            ],
            cancellationNotices: [
              this.currentInvoice
                ? this.currentInvoice.cancellationNotices
                : null,
            ],
            borderColor: [
              this.currentInvoice ? this.currentInvoice.borderColor : '#0000FF',
            ],
            paymentStatus: [
              this.currentInvoice ? this.currentInvoice.paymentStatus : false,
            ],
            individualId: [
              this.currentInvoice ? this.currentInvoice.individualId : null,
              [Validators.required],
            ],
            addedBy: [
              this.currentInvoice
                ? this.currentInvoice.addedBy
                : this.currentUser.firstName + ' ' + this.currentUser.lastName,
              [Validators.required],
            ],
            editedBy: [
              this.currentInvoice ? this.currentInvoice.editedBy : null,
            ],
          }),
      buyer: this.doesInvoiceBelongsToCompany
        ? this.fb.group({
            name: [
              this.currentInvoice ? this.currentInvoice.buyer.name : null,
              [Validators.required],
            ],
            J: [
              this.currentInvoice ? this.currentInvoice.buyer.J : null,
              [Validators.required],
            ],
            CUI: [
              this.currentInvoice ? this.currentInvoice.buyer.CUI : null,
              [Validators.required],
            ],
            headquarters: [
              this.currentInvoice
                ? this.currentInvoice.buyer.headquarters
                : null,
              [Validators.required],
            ],
            county: [
              this.currentInvoice ? this.currentInvoice.buyer.county : null,
              [Validators.required],
            ],
            bankAccount: [
              this.currentInvoice
                ? this.currentInvoice.buyer.bankAccount
                : null,
            ],
            bank: [this.currentInvoice ? this.currentInvoice.buyer.bank : null],
            _id: [this.currentInvoice ? this.currentInvoice.buyer._id : null],
          })
        : this.fb.group({
            name: [
              this.currentInvoice ? this.currentInvoice.buyer.name : null,
              [Validators.required],
            ],
            series: [
              this.currentInvoice ? this.currentInvoice.buyer.series : null,
              [Validators.required],
            ],
            CNP: [
              this.currentInvoice ? this.currentInvoice.buyer.CNP : null,
              [Validators.required],
            ],
            headquarters: [
              this.currentInvoice
                ? this.currentInvoice.buyer.headquarters
                : null,
              [Validators.required],
            ],
            county: [
              this.currentInvoice ? this.currentInvoice.buyer.county : null,
              [Validators.required],
            ],
            bankAccount: [
              this.currentInvoice
                ? this.currentInvoice.buyer.bankAccount
                : null,
            ],
            bank: [this.currentInvoice ? this.currentInvoice.buyer.bank : null],
            _id: [this.currentInvoice ? this.currentInvoice.buyer._id : null],
          }),
      seller: this.fb.group({
        name: [this.myCompany.name, [Validators.required]],
        J: [this.myCompany.J, [Validators.required]],
        CUI: [this.myCompany.CUI, [Validators.required]],
        headquarters: [this.myCompany.headquarters, [Validators.required]],
        county: [this.myCompany.county, [Validators.required]],
        bankAccount: [this.myCompany.bankAccount],
        bank: [this.myCompany.bank],
        treasury: [this.myCompany.treasury],
        socialCapital: [this.myCompany.socialCapital],
        vatRate: [this.myCompany.vatRate, [Validators.required]],
        delegatesName: [this.myCompany.delegatesName],
        email: [this.myCompany.email],
        phone: [this.myCompany.phone],
        _id: [this.myCompany._id],
      }),
      contract: this.fb.group({
        number: [
          this.currentInvoice ? this.currentInvoice.contract.number : null,
          [Validators.required],
        ],
        subjectOfContract: [
          this.currentInvoice
            ? this.currentInvoice.contract.subjectOfContract
            : null,
          [Validators.required],
        ],
        paymentAdvance: [
          this.currentInvoice
            ? this.currentInvoice.contract.paymentAdvance
            : null,
        ],
        restOfPayment: [
          this.currentInvoice
            ? this.currentInvoice.contract.restOfPayment
            : null,
        ],
        transport: [
          this.currentInvoice ? this.currentInvoice.contract.transport : null,
        ],
        installation: [
          this.currentInvoice
            ? this.currentInvoice.contract.installation
            : null,
        ],
        paymentMethod: [
          this.currentInvoice
            ? this.currentInvoice.contract.paymentMethod
            : null,
        ],
        deliveryTime: [
          this.currentInvoice
            ? this.currentInvoice.contract.deliveryTime
            : null,
        ],
        content: [
          this.currentInvoice
            ? this.currentInvoice.contract.content
            : this.selectedContractModel.content,
        ],
        contractModel: [
          this.currentInvoice
            ? this.currentInvoice.contract.contractModel
            : this.selectedContractModel,
        ],
        addedBy: [
          this.currentInvoice
            ? this.currentInvoice.addedBy
            : this.currentUser.firstName + ' ' + this.currentUser.lastName,
          [Validators.required],
        ],
        editedBy: [this.currentInvoice ? this.currentInvoice.editedBy : null],
      }),
      products: this.fb.array(
        this.getExistingProducts(
          this.currentInvoice ? this.currentInvoice.products : []
        ),
        [Validators.required]
      ),
    });
  }

  private setBuyerForm(buyer: IBuyer): void {
    // first save the buyerGroup into a variable
    const buyerGroup = buyer.hasOwnProperty('CUI')
      ? this.fb.group({
          name: [buyer.name, [Validators.required]],
          J: [buyer.J, [Validators.required]],
          CUI: [buyer.CUI, [Validators.required]],
          headquarters: [buyer.headquarters, [Validators.required]],
          county: [buyer.county, [Validators.required]],
          bankAccount: [buyer.bankAccount],
          bank: [buyer.bank],
          _id: [this.currentInvoice ? this.currentInvoice.buyer._id : null],
        })
      : this.fb.group({
          name: [buyer.name, [Validators.required]],
          series: [buyer.series, [Validators.required]],
          CNP: [buyer.CNP, [Validators.required]],
          headquarters: [buyer.headquarters, [Validators.required]],
          county: [buyer.county, [Validators.required]],
          bankAccount: [buyer.bankAccount],
          bank: [buyer.bank],
          _id: [this.currentInvoice ? this.currentInvoice.buyer._id : null],
        });
    // change the buyer grup
    this.addEditInvoiceForm.controls['buyer'] = buyerGroup;
    // change the values of buyer to buyerGroup.value
    this.addEditInvoiceForm.patchValue({ buyer: buyerGroup.value });
  }
}

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
          content: this.selectedContractModel,
        });
        console.log(this.addEditInvoiceForm.value);
      }
    });
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
          this.isLoading = false;
        })
      )
      .subscribe({
        next: (contractModels) => {
          if (contractModels.length) {
            this.contractModels = contractModels;
            this.selectedContractModel = this.contractModels.find(
              (model) => model._id === selectedContractModelId
            );
            if (!this.selectedContractModel) {
              this.selectedContractModel = this.contractModels[0];
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

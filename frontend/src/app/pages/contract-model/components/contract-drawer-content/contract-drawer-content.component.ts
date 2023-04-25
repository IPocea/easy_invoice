import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  SimpleChange,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  IContractModel,
  IContractModelResponse,
  ITokens,
  IUser,
} from '@interfaces';
import {
  ContractModelService,
  LoginDataService,
  NotificationService,
  StorageService,
  TokenService,
} from '@services';
import {
  quillBasicModule,
  contractModelInstructions,
  mandatoryContractModelsFields,
  contractModelsAllFieldsPattern,
} from '@utils';
import { QuillEditorComponent } from 'ngx-quill';
import Quill from 'quill';
import { finalize, take } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

class PreserveWhiteSpace {
  constructor(private quill: any, private options: {}) {
    quill.container.style.whiteSpace = 'pre-line';
  }
}

Quill.register('modules/preserveWhiteSpace', PreserveWhiteSpace); // we need the code in order to
// preserve white spaces

@Component({
  selector: 'app-contract-drawer-content',
  templateUrl: './contract-drawer-content.component.html',
  styleUrls: ['./contract-drawer-content.component.scss'],
})
export class ContractDrawerContentComponent implements OnInit {
  @Input() models: IContractModel[];
  @Input() currentUser: IUser;
  @Input() selectedModel: IContractModel;
  @Output() openDrawerEvent = new EventEmitter<boolean>();
  @Output() sendNewModelsEvent = new EventEmitter<IContractModelResponse>();
  @ViewChild(QuillEditorComponent, { static: true })
  editor: QuillEditorComponent;
  quillModules = quillBasicModule;
  quillHeight: string = '';
  contractModelInstructions: string = contractModelInstructions;
  addEditContractModelForm: FormGroup;
  addEditBtnValue: string = 'Adauga model';
  isLoading: boolean = false;
  mandatoryFields: string[] = environment.contractModels.mandatoryFields;
  acceptedFields: string[] = environment.contractModels.acceptedFields;
  mandatoryFieldsPattern: RegExp = mandatoryContractModelsFields(
    this.mandatoryFields
  );
  allFieldsPattern: RegExp = contractModelsAllFieldsPattern;
  fieldsValidationMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private notificationService: NotificationService,
    private contractModelService: ContractModelService,
    private storageService: StorageService,
    private tokenService: TokenService,
    private loginDataService: LoginDataService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.quillHeight = window.screen.availWidth >= 820 ? '600px' : '250px';
    this.setForm();
  }

  ngOnChanges(changes: SimpleChange): void {
    this.isLoading = true;
    this.setForm();
    this.isLoading = false;
  }

  addEditContractModel(): void {
    this.isLoading = true;
    this.fieldsValidationMessage = '';
    this.validateAllMandatoryFields();
    this.validateAllFields();
    if (this.fieldsValidationMessage) {
      this.notificationService.error(this.fieldsValidationMessage);
      this.isLoading = false;
      return;
    }
    const trimedName = this.addEditContractModelForm.value.name;
    this.addEditContractModelForm.controls['name'].setValue = trimedName;
    if (this.selectedModel) {
      this.editModel();
    } else {
      this.addModel();
    }
  }

  previewModel() {
    this.isLoading = true;
    this.refreshToken();
  }

  openDrawer(): void {
    this.openDrawerEvent.emit(true);
  }

  sendNewModels(modelsRes: IContractModelResponse): void {
    const models = {
      models: modelsRes.models.sort((a, b) =>
        a.name.toLocaleLowerCase() < b.name.toLocaleLowerCase() ? -1 : 1
      ),
      model: modelsRes.model,
    };
    this.sendNewModelsEvent.emit(models);
  }

  insertFieldText(fieldText: string): void {
    const range = this.editor.quillEditor.getSelection();
    const position = range
      ? range.index
      : this.editor.quillEditor.scroll.length() - 1;
    this.editor.quillEditor.insertText(position, fieldText);
    this.addEditContractModelForm.controls['content'].setValue(
      this.editor.quillEditor.root.innerHTML
    );
  }

  private addModel(): void {
    this.contractModelService
      .addContractModel(this.addEditContractModelForm.value)
      .pipe(
        take(1),
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe({
        next: (modelsRes: IContractModelResponse) => {
          if (!this.models.length) {
            this.storageService.setItem(
              'selectedContractModelId',
              modelsRes.model
            );
          }
          this.sendNewModels(modelsRes);
          this.notificationService.info('Modelul a fost creat');
        },
        error: (err) => {
          this.notificationService.error(err.error.message);
        },
      });
  }

  private editModel(): void {
    this.contractModelService
      .editContractModel(
        this.selectedModel._id,
        this.addEditContractModelForm.value
      )
      .pipe(
        take(1),
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe({
        next: (modelsRes: IContractModelResponse) => {
          this.sendNewModels(modelsRes);
          this.notificationService.info('Modelul a fost editat');
        },
        error: (err) => {
          this.notificationService.error(err.error.message);
        },
      });
  }

  private generatePdf(): void {
    this.contractModelService
      .getContractModelUrl(this.addEditContractModelForm.value)
      .pipe(
        take(1),
        finalize(() => {
          this.isLoading = false;
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
  private setForm(): void {
    if (this.selectedModel) {
      this.addEditBtnValue = 'Editeaza model';
      this.addEditContractModelForm = this.fb.group({
        name: [this.selectedModel.name, [Validators.required]],
        content: [this.selectedModel.content, [Validators.required]],
        addedBy: [this.selectedModel.addedBy, [Validators.required]],
        editedBy: [
          this.currentUser.firstName + ' ' + this.currentUser.lastName,
          [Validators.required],
        ],
      });
    } else {
      this.addEditBtnValue = 'Adauga model';
      this.addEditContractModelForm = this.fb.group({
        name: [null, [Validators.required]],
        content: [null, [Validators.required]],
        addedBy: [
          this.currentUser.firstName + ' ' + this.currentUser.lastName,
          [Validators.required],
        ],
        editedBy: [null],
      });
    }
  }

  private validateAllMandatoryFields() {
    const content: string = this.addEditContractModelForm.value.content;
    if (!this.mandatoryFieldsPattern.test(content)) {
      const missingFields: string[] = [];
      for (const field of this.mandatoryFields) {
        const pattern: RegExp = new RegExp(field, 'gi');
        if (!content.match(pattern)) {
          missingFields.push(field);
        }
      }
      this.fieldsValidationMessage += `Lipsesc urmatoarele campuri obligatorii: ${missingFields.join(
        ', '
      )}. `;
    }
  }

  private validateAllFields() {
    let content: string = this.addEditContractModelForm.value.content;
    const allFields = content.match(this.allFieldsPattern);
    let areUnacceptedFields: boolean = false;
    if (allFields) {
      for (const field of allFields) {
        if (!this.acceptedFields.includes(field.toLowerCase())) {
          const pattern = new RegExp(field, 'gi');
          content = content.replace(
            pattern,
            `<span style="background-color: #f8d7da; color: #721c24;">${field}</span>`
          );
          areUnacceptedFields = true;
        }
      }
      if (areUnacceptedFields) {
        this.addEditContractModelForm.controls['content'].setValue(content);
        this.fieldsValidationMessage +=
          'Ai adaugat campuri neexistente. Le poti identifica evidentiate cu fundalul rosu. ';
      }
    }
  }

  private refreshToken(): void {
    const tokens: ITokens = this.storageService.getItem('tokens') as ITokens;
    this.tokenService
      .useRefreshToken(tokens.refreshToken)
      .pipe(take(1))
      .subscribe({
        next: (tokens) => {
          this.storageService.setItem('tokens', tokens);
          this.generatePdf();
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
}

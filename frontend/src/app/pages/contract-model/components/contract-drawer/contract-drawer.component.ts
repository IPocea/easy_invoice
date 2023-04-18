import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  SimpleChange,
  ViewChild,
} from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatExpansionPanel } from '@angular/material/expansion';
import {
  IContractModel,
  IContractModelResponse,
  ITableFilters,
  IUser,
} from '@interfaces';
import {
  ContractModelService,
  NotificationService,
  StorageService,
} from '@services';
import { ConfirmationDialogComponent } from '@shared/components/confirmation-dialog/confirmation-dialog.component';
import { finalize, take } from 'rxjs';

@Component({
  selector: 'app-contract-drawer',
  templateUrl: './contract-drawer.component.html',
  styleUrls: ['./contract-drawer.component.scss'],
})
export class ContractDrawerComponent implements OnInit {
  @Input() models: IContractModel[];
  @Input() currentUser: IUser;
  @Input() selectedModel: IContractModel;
  @Input() areModelsDisplayed: boolean;
  @Output() sendNewModelsEventFromDrawer =
    new EventEmitter<IContractModelResponse>();
  @Output() closeDrawerEvent = new EventEmitter<boolean>();
  @Output() sendFilters = new EventEmitter<ITableFilters>();
  @ViewChild('panel') panel: MatExpansionPanel;
  searchValue: string = '';
  typingTimer: ReturnType<typeof setTimeout>;
  typingInt: number = 350;
  filters: ITableFilters = { searchValue: '' };
  confirmDialogRef: MatDialogRef<ConfirmationDialogComponent>;
  isDeleting: boolean = false;

  constructor(
    public dialog: MatDialog,
    private contractModelService: ContractModelService,
    private storageService: StorageService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChange): void {}

  deleteModel(ev: Event, modelId: string): void {
    ev.stopPropagation();
    this.isDeleting = true;
    this.confirmAndDelete(modelId);
  }

  emptyForm(): void {
    this.sendNewModelsEventFromDrawer.emit({
      models: this.models,
      model: null,
    });
    this.closeDrawer();
  }

  selectModel(ev: Event, model: IContractModel): void {
    ev.stopPropagation();
    this.storageService.setItem('selectedContractModelId', model._id);
    this.sendSelectedModel(model);
  }

  applySearchFilter(): void {
    this.clearTimeout();
    this.typingTimer = setTimeout(
      this.searchByValue.bind(this),
      this.typingInt
    );
  }

  clearTimeout(): void {
    clearTimeout(this.typingTimer);
  }

  clearSearchValue(): void {
    this.searchValue = '';
    this.searchByValue();
  }

  private confirmAndDelete(modelId: string): void {
    this.confirmDialogRef = this.dialog.open(ConfirmationDialogComponent, {
      disableClose: true,
    });
    this.confirmDialogRef.componentInstance.title = 'Sterge modelul';
    this.confirmDialogRef.componentInstance.content =
      this.models.length === 1
        ? 'Esti sigur ca doresti sa stergi acest model? Este singurul model din lista.'
        : 'Esti sigur ca doresti sa stergi acest model?';
    this.confirmDialogRef.afterClosed().subscribe((res) => {
      if (res) {
        this.removeModel(modelId);
      } else {
        this.isDeleting = false;
      }
    });
  }

  private removeModel(modelId: string): void {
    this.contractModelService
      .deleteContractModel(modelId, this.filters)
      .pipe(
        take(1),
        finalize(() => {
          this.isDeleting = false;
        })
      )
      .subscribe({
        next: (models: IContractModel[]) => {
          const currentUserSelectedModelId = this.storageService.getItem(
            'selectedContractModelId'
          );
          if (
            currentUserSelectedModelId &&
            modelId === currentUserSelectedModelId
          ) {
            if (models.length) {
              this.storageService.setItem(
                'selectedContractModelId',
                models[0]._id
              );
            } else {
              this.storageService.removeItem('selectedContractModelId');
            }
          }
          this.sendNewModelsEventFromDrawer.emit({
            models: models,
            model: models.length ? models[0] : null,
          });
          this.notificationService.info('Modelul a fost sters');
        },
        error: (err) => {
          this.notificationService.error(err.error.message);
        },
      });
  }

  private closeDrawer(): void {
    this.closeDrawerEvent.emit(false);
  }

  private sendSelectedModel(model: IContractModel): void {
    this.sendNewModelsEventFromDrawer.emit({
      models: this.models,
      model: model,
    });
    this.closeDrawer();
  }

  private searchByValue(): void {
    this.resetFiltersObj();
    if (this.searchValue.trim()) {
      this.filters = {
        searchValue: this.searchValue.trim(),
      };
    }
    this.requestFilteredData(this.filters);
  }

  private resetFiltersObj(): void {
    this.filters = null;
  }

  private requestFilteredData(filters: ITableFilters): void {
    this.sendFilters.emit(filters);
  }
}

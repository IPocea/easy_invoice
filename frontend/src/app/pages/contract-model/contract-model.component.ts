import { Component, OnInit, ViewChild } from '@angular/core';
import {
  IContractModel,
  IContractModelResponse,
  ITableFilters,
  IUser,
} from '@interfaces';
import {
  ContractModelService,
  LoginDataService,
  StorageService,
} from '@services';
import { quillBasicModule } from '@utils';
import { finalize, take } from 'rxjs';

@Component({
  selector: 'app-contract-model',
  templateUrl: './contract-model.component.html',
  styleUrls: ['./contract-model.component.scss'],
})
export class ContractModelComponent implements OnInit {
  @ViewChild('drawer') drawer;
  currentUser: IUser = null;
  selectedModel: IContractModel = null;
  models: IContractModel[] = null;
  quillModules = quillBasicModule;
  quillHeight: string = '';
  isLoading: boolean = false;
  isDrawerContentReady: boolean = false;
  areModelsDisplayed: boolean = false;

  constructor(
    private contractModelService: ContractModelService,
    private storageService: StorageService,
    private loginDataService: LoginDataService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.loginDataService.getLoggedUser();
    this.getAllModels();
  }

  toggleDrawer(ev: boolean): void {
    if (!ev) this.areModelsDisplayed = false;
    this.drawer.toggle();
  }

  onOpenChange(openStatus: boolean): void {
    this.areModelsDisplayed = false;
    if (openStatus) {
      this.getAllModels(false);
    }
  }

  sendFilteredModels(ev: ITableFilters): void {
    this.getFilteredModels(ev);
  }

  sendNewModels(ev: IContractModelResponse): void {
    this.models = this.sortModelsInsensitive(ev.models);
    this.selectedModel = ev.model;
    if (
      !this.storageService.getItem('selectedContractModelId') &&
      this.selectedModel
    ) {
      this.storageService.setItem(
        'selectedContractModelId',
        this.selectedModel._id
      );
    }
  }

  private getAllModels(triggerLoading: boolean = true): void {
    this.areModelsDisplayed = false;
    if (triggerLoading) this.isLoading = true;
    this.contractModelService
      .getContractModels(null)
      .pipe(
        take(1),
        finalize(() => {
          if (triggerLoading) {
            const selectedModelId = this.storageService.getItem(
              'selectedContractModelId'
            ) as string;
            const modelIfSelectedUserModelExists = selectedModelId
              ? this.checkModel(selectedModelId)
              : null;
            if (this.models.length) {
              this.selectedModel = modelIfSelectedUserModelExists
                ? modelIfSelectedUserModelExists
                : this.models[0];
            }
          }
          this.isLoading = false;
          this.areModelsDisplayed = triggerLoading ? false : true;
        })
      )
      .subscribe({
        next: (models: IContractModel[]) => {
          this.models = this.sortModelsInsensitive(models);
          this.isDrawerContentReady = true;
        },
        error: (err) => {
          this.models = [];
        },
      });
  }

  private getFilteredModels(filters: ITableFilters): void {
    this.contractModelService
      .getContractModels(filters)
      .pipe(take(1))
      .subscribe({
        next: (models: IContractModel[]) => {
          this.models = this.sortModelsInsensitive(models);
        },
        error: (err) => {
          this.models = [];
        },
      });
  }

  private checkModel(modelId: string): IContractModel {
    return this.models.find((model) => model._id === modelId);
  }

  private sortModelsInsensitive(models: IContractModel[]): IContractModel[] {
    if (models.length) {
      models = models.sort((a, b) =>
        a.name.toLocaleLowerCase() < b.name.toLocaleLowerCase() ? -1 : 1
      );
    }
    return models;
  }
}

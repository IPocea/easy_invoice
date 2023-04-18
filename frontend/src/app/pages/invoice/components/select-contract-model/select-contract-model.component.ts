import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { IContractModel, ITableFilters } from '@interfaces';
import { ContractModelService, NotificationService } from '@services';
import { take } from 'rxjs';

@Component({
  selector: 'app-select-contract-model',
  templateUrl: './select-contract-model.component.html',
  styleUrls: ['./select-contract-model.component.scss'],
})
export class SelectContractModelComponent implements OnInit {
  contractModels: IContractModel[] = [];
  isNotFoundDisplayed: boolean = false;
  searchValue: string = '';
  typingTimer: ReturnType<typeof setTimeout>;
  typingInt: number = 350;
  filters: ITableFilters = {
    pageIndex: '0',
    pageSize: '10',
  };

  constructor(
    public dialogRef: MatDialogRef<SelectContractModelComponent>,
    private contractModelService: ContractModelService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {}

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
    this.isNotFoundDisplayed = false;
    this.searchByValue();
  }

  closeDialog(): void {
    this.dialogRef.close({ event: 'Cancel' });
  }

  sendContractModel(contractModel: IContractModel): void {
    this.dialogRef.close({
      event: 'Send Contract Model',
      contractModel: contractModel,
    });
  }

  private searchByValue(): void {
    this.isNotFoundDisplayed = false;
    if (this.searchValue.trim()) {
      this.filters.searchValue = this.searchValue.trim();
      this.searchContractModels();
    } else {
      this.contractModels = [];
    }
  }

  private searchContractModels(): void {
    this.contractModelService
      .getContractModels(this.filters)
      .pipe(take(1))
      .subscribe({
        next: (contractModels) => {
          this.contractModels = contractModels;
          if (!this.contractModels.length) {
            this.isNotFoundDisplayed = true;
          }
        },
        error: (err) => {
          this.contractModels = [];
          this.isNotFoundDisplayed = true;
          this.notificationService.error(err.error.message);
        },
      });
  }
}

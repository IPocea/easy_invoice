import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ContractsRoutingModule } from './contracts-routing.module';
import { ContractsComponent } from './contracts.component';
import { MatDialogModule } from '@angular/material/dialog';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import {
  MatPaginatorIntl,
  MatPaginatorModule,
} from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { SharedModule } from '@shared/modules/shared.module';
import { MatPaginatorIntlCro } from '@helpers';
import { MatTableContractsComponent } from './components/mat-table-contracts/mat-table-contracts.component';

@NgModule({
  declarations: [ContractsComponent, MatTableContractsComponent],
  imports: [
    CommonModule,
    ContractsRoutingModule,
    MatDialogModule,
    DragDropModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatButtonModule,
    MatTooltipModule,
    MatInputModule,
    MatIconModule,
    FormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    SharedModule,
  ],
  providers: [{ provide: MatPaginatorIntl, useClass: MatPaginatorIntlCro }],
})
export class ContractsModule {}

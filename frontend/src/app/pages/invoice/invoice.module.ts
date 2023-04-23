import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InvoiceRoutingModule } from './invoice-routing.module';
import { InvoiceComponent } from './invoice.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DATE_LOCALE, MatNativeDateModule } from '@angular/material/core';
import { QuillModule } from 'ngx-quill';
import { MatDialogModule } from '@angular/material/dialog';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { AddChangeBuyerComponent } from './components/add-change-buyer/add-change-buyer.component';
import { SelectContractModelComponent } from './components/select-contract-model/select-contract-model.component';
import { MatButtonToggleModule } from '@angular/material/button-toggle';

@NgModule({
  declarations: [
    InvoiceComponent,
    AddChangeBuyerComponent,
    SelectContractModelComponent,
  ],
  imports: [
    CommonModule,
    InvoiceRoutingModule,
    MatProgressSpinnerModule,
    MatIconModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatButtonModule,
    MatTooltipModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatDialogModule,
    DragDropModule,
    FormsModule,
    MatButtonToggleModule,
    QuillModule.forRoot(),
  ],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'ro-RO' }],
})
export class InvoiceModule {}

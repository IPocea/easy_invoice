import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ContractModelRoutingModule } from './contract-model-routing.module';
import { ContractModelComponent } from './contract-model.component';
import { MatDialogModule } from '@angular/material/dialog';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '@shared/modules/shared.module';
import { MatSidenavModule } from '@angular/material/sidenav';
import { QuillModule } from 'ngx-quill';
import { ContractDrawerContentComponent } from './components/contract-drawer-content/contract-drawer-content.component';
import { ContractDrawerComponent } from './components/contract-drawer/contract-drawer.component';
import { MatExpansionModule } from '@angular/material/expansion';

@NgModule({
  declarations: [
    ContractModelComponent,
    ContractDrawerContentComponent,
    ContractDrawerComponent,
  ],
  imports: [
    CommonModule,
    ContractModelRoutingModule,
    MatDialogModule,
    DragDropModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatButtonModule,
    MatTooltipModule,
    MatInputModule,
    MatIconModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
    MatSidenavModule,
    MatExpansionModule,
    SharedModule,
    QuillModule.forRoot(),
  ],
})
export class ContractModelModule {}

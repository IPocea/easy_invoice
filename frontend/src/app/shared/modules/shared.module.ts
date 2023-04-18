import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from '@shared/components/header/header.component';
import { FooterComponent } from '@shared/components/footer/footer.component';
import { SideNavComponent } from '@shared/components/side-nav/side-nav.component';
import { CustomDatePipe, CustomCurrencyPipe, WordSeparatorPipe, UserInitialsPipe } from '@pipes';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableComponent } from '@shared/components/mat-table/mat-table.component';
import { ConfirmationDialogComponent } from '@shared/components/confirmation-dialog/confirmation-dialog.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { PdfGeneratorComponent } from '../components/pdf-generator/pdf-generator.component';
import { QuillModule } from 'ngx-quill';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    FormsModule,
    MatIconModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    DragDropModule,
    QuillModule.forRoot(),
  ],
  declarations: [
    HeaderComponent,
    FooterComponent,
    SideNavComponent,
    CustomDatePipe,
    CustomCurrencyPipe,
    MatTableComponent,
    WordSeparatorPipe,
    ConfirmationDialogComponent,
    UserInitialsPipe,
    PdfGeneratorComponent,
  ],
  exports: [
    HeaderComponent,
    FooterComponent,
    CommonModule,
    SideNavComponent,
    CustomDatePipe,
    CustomCurrencyPipe,
    MatTableComponent,
    WordSeparatorPipe,
    ConfirmationDialogComponent,
    UserInitialsPipe,
    PdfGeneratorComponent,
  ],
})
export class SharedModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WelcomeRoutingModule } from './welcome-routing.module';
import { WelcomeComponent } from './welcome.component';
import { MatDialogModule } from '@angular/material/dialog';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { TextFieldModule } from '@angular/cdk/text-field';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '@shared/modules/shared.module';
import { ChangeOwnPasswordComponent } from './components/change-own-password/change-own-password.component';

@NgModule({
  declarations: [WelcomeComponent, ChangeOwnPasswordComponent],
  imports: [
    CommonModule,
    WelcomeRoutingModule,
    MatDialogModule,
    DragDropModule,
    MatProgressSpinnerModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatButtonModule,
    MatTooltipModule,
    MatInputModule,
    MatIconModule,
    TextFieldModule,
    FormsModule,
    SharedModule,
  ],
})
export class WelcomeModule {}

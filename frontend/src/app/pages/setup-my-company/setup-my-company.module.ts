import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SetupMyCompanyRoutingModule } from './setup-my-company-routing.module';
import { SetupMyCompanyComponent } from './setup-my-company.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@NgModule({
  declarations: [SetupMyCompanyComponent],
  imports: [
    CommonModule,
    SetupMyCompanyRoutingModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
  ],
})
export class SetupMyCompanyModule {}

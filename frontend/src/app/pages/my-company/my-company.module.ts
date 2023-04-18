import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MyCompanyRoutingModule } from './my-company-routing.module';
import { MyCompanyComponent } from './my-company.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '@shared/modules/shared.module';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@NgModule({
  declarations: [MyCompanyComponent],
  imports: [
    CommonModule,
    MyCompanyRoutingModule,
    ReactiveFormsModule,
    SharedModule,
    MatProgressSpinnerModule,
  ],
})
export class MyCompanyModule {}

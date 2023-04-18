import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContractModelComponent } from './contract-model.component';

const routes: Routes = [{ path: '', component: ContractModelComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContractModelRoutingModule { }

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SetupMyCompanyComponent } from './setup-my-company.component';

const routes: Routes = [{ path: '', component: SetupMyCompanyComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SetupMyCompanyRoutingModule { }

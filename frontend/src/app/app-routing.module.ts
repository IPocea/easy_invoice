import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AdminGuard, NonAuth, AuthGuard } from '@guards';

const routes: Routes = [
  {
    path: 'societati',
    loadChildren: () =>
      import('./pages/companies/companies.module').then(
        (m) => m.CompaniesModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'contracte',
    loadChildren: () =>
      import('./pages/contracts/contracts.module').then(
        (m) => m.ContractsModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'persoane-fizice',
    loadChildren: () =>
      import('./pages/individuals/individuals.module').then(
        (m) => m.IndividualsModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'factura/:id',
    loadChildren: () =>
      import('./pages/invoice/invoice.module').then((m) => m.InvoiceModule),
  },
  {
    path: 'facturi',
    loadChildren: () =>
      import('./pages/invoices/invoices.module').then((m) => m.InvoicesModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'login',
    loadChildren: () =>
      import('./pages/login/login.module').then((m) => m.LoginModule),
    canActivate: [NonAuth],
  },
  {
    path: 'adauga-societatea-mea',
    loadChildren: () =>
      import('./pages/setup-my-company/setup-my-company.module').then(
        (m) => m.SetupMyCompanyModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'societatea-mea',
    loadChildren: () =>
      import('./pages/my-company/my-company.module').then(
        (m) => m.MyCompanyModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'not-found',
    loadChildren: () =>
      import('./pages/not-found/not-found.module').then(
        (m) => m.NotFoundModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'useri',
    loadChildren: () =>
      import('./pages/users/users.module').then((m) => m.UsersModule),
    canActivate: [AuthGuard, AdminGuard],
  },
  {
    path: 'bine-ai-venit',
    loadChildren: () =>
      import('./pages/welcome/welcome.module').then((m) => m.WelcomeModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'ai-uitat-parola',
    loadChildren: () =>
      import('./pages/forgot-password/forgot-password.module').then(
        (m) => m.ForgotPasswordModule
      ),
    canActivate: [NonAuth],
  },
  {
    path: 'reseteaza-parola',
    loadChildren: () =>
      import('./pages/reset-password/reset-password.module').then(
        (m) => m.ResetPasswordModule
      ),
  },
  {
    path: 'modele-contract',
    loadChildren: () =>
      import('./pages/contract-model/contract-model.module').then(
        (m) => m.ContractModelModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: 'not-found',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes), CommonModule],
  exports: [RouterModule],
})
export class AppRoutingModule {}

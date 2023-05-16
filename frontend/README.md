# EasyInvoice

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 14.2.0.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.

## General info

Most of app functionality is accessible if you are logged in. You are not able to create an username with a registration form. Only the admin can creeate users once the admin is logged in.

While not logged in, if you forgot your password you can use `ai-uitat-parola` route to reset the password via email. 

The app is protected by guards (Auth, NonAuth and Admin) and is using a request interceptor. If both access and refresh tokens are expired you will be redirected to `/login`.

You can find the routes with a more specific description below.

## Routes

### `/login`

Here you can insert your username and password in order to login. From here you can access `ai-uitat-parola` route.

### `/ai-uitat-parola`

On this route you can insert your email address and receive a link which will help you reset your password. That link will redirect you to the route `reseteaza-parola`.

### `/reseteaza-parola`

From the email you will be redirected to this route. Here you can change your password. You will not be allowed to change the password with the same value as the current password.

### `/adauga-societatea-mea`

First time you logged in you will have to add your company details. Only the admin can do that. The users will only see a message that ask them to contact an admin. If company is added and you try to enter this route, you will be redirected to `bine-ati-venit` route. Once the company is added you will be redirected to `bine-ati-venit`.

### `/bine-ai-venit`

Once you are logged in (and you have your company added) you will be redirected to this route where you will find your user details, a button that will allow you to change your password (it cannot be the current password), logout and save a private note (as textarea) locally (in local storage). Once you are logged in you will have a side nav (on the left on >= 820px width or on top on < 820px width) which will redirect you to different routes depending what you chose.

### `/factura/:id`

This route cover two situations:

- on `factura/adauga` you will be able to select buyer (add new if is needed), contract model, add required data in order to add an invoice
- on `factura/:id` you will be able to view and edit the selected invoice. More functionality on this route:
  - generate pdf of invoice and contract
  - view history of the selected invoice
  - view and manage payments (add and remove - only admin - payments)
  - cancel invoice (you are allow to add cancellation mentions)
  - delete invoice (only admin). Attention! The deletion will delete all data related to the selected invoice (invoice, contract, payments, history)

If there is no contract model saved in your database, you will be redirected to `modele-contract` route where you will be able to do a contract model.  

Note: When you have a saved invoice, the contract model and buyer displayed is the once they were saved at the moment of adding / editing the invoice. If for example you changed the contract model after you added an invoice and you want to update the contract based on the updated contract model, you need to select again the contract model on edit mode and edit the invoice.

### `/facturi`

This route will display the list of invoices in a Mat Table format with pagination, search and sort.
From here you will be able to view some invoice details, to generate invoice as pdf and to go to the selected invoice, on the route `factura/:id`.

### `/contracte`

This route will display the list of contracts in a Mat Table format with pagination, search and sort.
From here you will be able to view some contract details, to generate contract as pdf and to go to the selected invoice which the contracts belongs to, on the route `factura/:id`.

### `/persoane-fizice`

This route will display the list of individuals  in a Mat Table format with pagination, search and sort. 

You will also have posibility to add, activate, deactivate, edit or view the individual. Only the admin can delete the individual.

Here you can see the total amount of invoices (which are not cancelled) made for the selected individual and the paid total ammount of invoices (which are not cancelled) made for the selected individual.

Deleting an individual will not delete the invoices of that individual.

### `/societati`

This route will display the list of companies  in a Mat Table format with pagination, search and sort. 

You will also have posibility to add, activate, deactivate, edit or view the company. Only the admin can delete the company.

Here you can see the total amount of invoices (which are not cancelled) made for the selected company and the paid total ammount of invoices (which are not cancelled) made for the selected company.

Deleting a company will not delete the invoices of that company.

### `/societatea-mea`

This route will display a form with your company details and you will be able to edit them. The edit can be done by users too.

### `/modele-contract`

On this route you will be able to add a contract model and when you have at least a contract model you will be able to also select a saved contract model.

Here are some mandatory fields and accepted fields, shown in the bottom side of the page (under the quill container, below the add / edit button). When you click on them a value will be added where the carrot on quill is or if the quill is not edited then the value will be added at the start or end of the quill container.

An example of value is `{nume-furnizor}` . When an invoice and a contract is generated, instead of `nume-furnizor` on the contract the name of your company will be displayed.

Any user can delete models.

### `/useri`

This route is protected by `AuthGuard` and `AdminGuard`. Only the admin hav access here. 
The admin can view, add, edit (passwords included, but not as the current value), delete users, in the same Mat Table format, with search and pagination.

### `/not-found`

When you try to use a route (when logged in) which does not exists, you will be redirected to `not-found` route.

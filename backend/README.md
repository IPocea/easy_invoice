<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://kamilmysliwiec.com)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](LICENSE).


## Endpoints

Base endpoint is `http://localhost:3330/api`.

All routes are protected by `AccessTokenGuard`. 

Exceptions:

- `/auth/login`, which is protected by `LocalAuthGuard`
- `/auth/refresh`, which is protected by `RefreshTokenGuard`
- `/auth/reset-token-password` - `POST`, unprotected
- `/auth/reset-token-password` - `GET`, protected by `ResetTokenGuard`
- `/auth/reset-password`, protected by `ResetTokenGuard`

The returns of data with pagination are usually all in the same format:

- data: dependsOfEndpoint[];
- pageIndex: number;
- pageSize: number;
- totalItems: number;

General queries: IQueryParams used on returns with paginations are:

- pageIndex?: string;
-	pageSize?: string;
-	sortBy?: string;
-	searchValue?: string;
-	sortDirection?: string;

All actions on invoices and payments it will be stored in histories collection in database.

### Auth

#### `/auth/login`

`POST` request. 

Payload: {
  username: string;
  password: string;
}

Returns (if credentials are ok and the user is active) `accessToken` and `refreshToken`.

#### `/auth/logout`

`GET` request.

It will remove user's `refreshToken` form database and send an object: `{ message: "Ai fost delogat cu succes" }`.


#### `/auth/refresh`

`GET` request.

It will refresh the tokens if the `refreshToken` is valid and will send back a new `accessToken` and a new `refreshToken`.

#### `/auth/change-password/:id`

`POST` request.

Params:
 - `id` userId

Payload: {
  password: string;
}

It will change user's password. Only an user with the role of Admin can do this action. The password cannot be the same as the current one.

#### `/auth/reset-token-password`

`POST` request.

Payload: {
  email: string;
}

It will verify if the email belongs to an user and if yes then it will send an email to the user with the reset password link. The link is valid only for 15 minutes or until is used to change the password.

It will also return: `{message: "The email with the reset password link was sent. Please check your inbox."}`

`GET` request.

If the `resetToken` is valid it will return `{ message: "Access allowed" }`.

#### `/auth/reset-password`

`POST` request.

Payload: {
  password: string;
}

It will change the user password if the new value is different than the current value. It also destroyes the `resetToken`.

It will return `{ message: "Parola a fost schimbata cu succes" }`.

### Company

#### `/companies`

`GET` request.

It will return all companies in pagination format. 

It accept queries: IQueryParams.

#### `/companies/actives/get-all`

`GET` request.

It will return all active companies in pagination format. 

It accept queries: IQueryParams.

#### `/companies:id`

`GET` request.

Params:
- `id` companyId

It will return the company with the id from params.

#### `/companies/add`

`POST` request.

Payload: {
 - name: string;
 - J: string;
 - CUI: string;
 - headquarters: string;
 - county: string;
 - vatRate: number;
 - bankAccount?: string;
 - bank?: string;
 - email?: string;
 - phone?: string;
 - isActivated?: boolean;
 - addedBy?: string;
 - editedBy?: string;
 - createdAt?: Date;
}

It will add the company in the database and it will return the companies based on query params.

It accept queries: IQueryParams.

#### `/companies/add-and-return-company`

`POST` request.

Same Payload, no query params.

It will add the company in the database and it will return it.

#### `/companies/:id/edit-company`

`PATCH` request.

Params:
- `id` companyId

Payload: {
 - name?: string;
 - J?: string;
 - CUI?: string;
 - headquarters?: string;
 - county?: string;
 - vatRate?: number;
 - bankAccount?: string;
 - bank?: string;
 - email?: string;
 - phone?: string;
 - isActivated?: boolean;
 - addedBy?: string;
 - editedBy?: string;
 - createdAt?: Date;
}

It will modify the company with the id from params and it will return the companies based on query params.

It accept queries: IQueryParams.

#### `/companies/:id/update-status`

`PATCH` request.

Params:
- `id` companyId

Payload: same as above but only `isActivated` is needed and only that value will be used.

It will change the value of `isActivated` of the company with the id from params and then it will return the companies based on query params.

It accept queries: IQueryParams.

#### `/companies/:id`

`DELETE` request.

Params:
- `id` companyId

It will delete the company with the id from params and then it will return the companies based on query params.

It accept queries: IQueryParams.

### Individual

#### `/individuals`

`GET` request.

It will return all individuals in pagination format. 

It accept queries: IQueryParams.

#### `/individuals/actives/get-all`

`GET` request.

It will return all active individuals in pagination format. 

It accept queries: IQueryParams.

#### `/individuals:id`

`GET` request.

Params:
- `id` individualId

It will return the individual with the id from params.

#### `/individuals/add`

`POST` request.

Payload: {
 - name: string;
 - series: string;
 - CNP: string;
 - headquarters: string;
 - county: string;
 - bankAccount?: string;
 - bank?: string;
 - email?: string;
 - phone?: string;
 - isActivated?: boolean;
 - addedBy?: string;
 - editedBy?: string;
 - createdAt?: Date;
}

It will add the individual in the database and it will return the individuals based on query params.

It accept queries: IQueryParams.

#### `/individuals/add-and-return-individual`

`POST` request.

Same Payload, no query params.

It will add the individual in the database and it will return it.

#### `/individuals/:id/edit-individual`

`PATCH` request.

Params:
- `id` individualId

Payload: {
 - name?: string;
 - series?: string;
 - CNP?: string;
 - headquarters?: string;
 - county?: string;
 - bankAccount?: string;
 - bank?: string;
 - email?: string;
 - phone?: string;
 - isActivated?: boolean;
 - addedBy?: string;
 - editedBy?: string;
 - createdAt?: Date;
}

It will modify the individual with the id from params and it will return the individuals based on query params.

It accept queries: IQueryParams.

#### `/individuals/:id/update-status`

`PATCH` request.

Params:
- `id` individualId

Payload: same as above but only `isActivated` is needed and only that value will be used.

It will change the value of `isActivated` of the inidivudal with the id from params and then it will return the individuals based on query params.

It accept queries: IQueryParams.

#### `/individuals/:id`

`DELETE` request.

Params:
- `id` individualId

It will delete the individual with the id from params and then it will return the individuals based on query params.

It accept queries: IQueryParams.


### Contract

#### `/contracts`

`GET` request.

It will return all contracts in pagination format. 

It accept queries: IQueryParams.

#### `/contracts:id`

`GET` request.

Params:
- `id` contractId

It will return the contract with the id from params.

#### `/contracts:id/get-pdf`

`GET` request.

Params:
- `id` contractId

It will return void.

It will open a new tab in frontend with te generated pdf contract.

### Contract model

#### `/contract-models`

`GET` request.

It will return all contracts based on queries params. 

It accept queries: IQueryParams.

#### `/contract-models/:id`

`GET` request.

Params:
- `id` contractModelId

It will return the contract model with the id from params.

#### `/contract-models/add`

Payload: {
 - name: string;
 - content: string;
 - addedBy?: string;
 - editedBy?: string;
 - createdAt?: Date;
}

It will add the contract model in the database and it will return an object: {
  - models: IContractModel[],
	- model: IContractModel,
}

#### `/contract-models/:id/edit-contract-model`

`PATCH` request.

Params:
- `id` contractModelId

Payload: same as above, but all keys are optional.

It will update the the contract model with the id from params and it will return an object: {
  - models: IContractModel[],
	- model: IContractModel,
}

#### `/contract-models/:id`

`DELETE` request.

Params:
- `id` contractModelId

It will delete the contract model with the id from params and it will return an array with the remaining contract models IContractModel[].

#### `/contract-models/show-contract-model/as-pdf`

`POST`request.

Payload: {
 - title: string;
 - content: string;
}

It will return void and it will open in frontend a new tab with the contract model as pdf, based on payload.

### History

#### `/histories/:invoiceId`

`GET` request.

Params:
- `invoiceId` invoiceId

It will return an array of all histories of the invoice with the id from params.

### My Company

#### `/my-company`

`GET` request.

It will return an array with all my companies, but it only be one element, at index 0.

`POST` request.

Payload: {
 - name: string;
 - J: string;
 - CUI: string;
 - headquarters: string;
 - county: string;
 - vatRate: number;
 - bankAccount: string;
 - bank: string;
 - treasury: string;
 - delegatesName: string;
 - email?: string;
 - phone?: string;
 - addedBy: string;
 - editedBy: string;
}

It will add my company in database and returns it.

#### `/my-company/:id`

`PATCH` request.

Params:
- `id` myCompanyId

Payload: as above, but all are optional.

It will update my company and returns it.

### Payments

#### `/payments/:invoiceId`

`GET` request.

Params:
- `invoiceId` invoiceId

It will return all payments of the invoice with the id from the params.

#### `/payments/add`

`POST` request.

Payload: {
 - paymentAmount: number;
 - invoiceId: Types.ObjectId;
 - addedBy: string;
 - editedBy: string;
 - createdAt?: Date;
}

It will add the payment and the historyAction in database.

It will return all payments of the invoice with the id of invoiceId from payload.

#### `/payments/:paymentId/:invoiceId/delete-payment`

`DELETE` request.

Params:
- `paymentId` paymentId
- `invoiceId` invoiceId

Only admin is allowed to do this action. It will delete the payment with the id from params, add the historyAction in database and returns all the remaining payments of the invoice with the id from params.

### Products

#### `/products/:invoiceId`

`GET` request.

Params:
- `invoiceId` invoiceId

It will return all products of the invoice with the id from params.

#### `/products/:productId`

`DELETE` request.

Params:
- `productId` productId

It will delete the product with the id from params and it will return: `{ message: "Produsul cu id-ul productId a fost sters" }`

### Profile

#### `/profile`

`GET` request.

It will get the user profile with the id from the `accesToken`.

#### `/profile/change-password`

`PATCH` request.

Payload: {
- userId: string;
-	password: string;
}

It allows the user to change his own password. The new password must be different than the current one.

### Users

All routes are accessible only by an admin.

#### `/users`

`GET` request.

It will return all users in pagination format. 

It accept queries: IQueryParams.

#### `/users/:id`

`GET` request.

Params: 
- `id` userId

It will return the user with the id from params.

`PATCH` request.

Params: 
- `id` userId

Payload: same as below (endpoint `/users/add`) but all are optional. Only `isActivated` value will be use.

It will change the user status (based on params) and it will return all users in pagination format. 

It accept queries: IQueryParams.

`DELETE` request.

Params: 
- `id` userId

It will delete the user (based on params) and it will reuturn all remaining users in pagination format. 

It accept queries: IQueryParams.

#### `/users/add`

`POST` request.

Payload: {
- username: string;
- password: string;
- email: string;
- firstName: string;
- lastName: string;
- role: string;
- isActivated: boolean;
}

It will add an user and it will return all users in pagination format.

It accept queries: IQueryParams.

#### `/users/:id`

`PATCH` request.

Params:
- `id` userId

Payload: same as above.

It will change the user (no password), based on params, and it will return all users in pagination format. 

It accept queries: IQueryParams.

#### `/users/:id/change-password`

`PATCH` request.

Params:
- `id` userId

Payload: same as above.

It will change the user password (based on params) and it will return all users in pagination format. 

It accept queries: IQueryParams.
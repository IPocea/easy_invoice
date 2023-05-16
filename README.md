# easy_invoice

## Short description

This app is not for real use. It's sole purpose is to prove my skills.

As functionality, this app help you save data of your users, your company and your clients. You can also make contract models based on which the contract will be generated in the same time with the invoice. On the route `/factura/adauga` you will be able to select buyer (add it if is not there), select contract, enter some data and save the invoice. On the same page, after the invoice is added you will be able to see the invoice and contract and manage the payments and history (there is a saved history for every invoice).

All of your data will be easily managed on Angular Mat Tables.

### How to install:

- run `npm i` in both frontend and backend folder
- in backend foldr write an .env file with the below keys:
  - `mongoDB` - the link with the mongoDB database
  - `accessTokenSecret` - secret for access token
  - `refreshTokenSecret` - secret for refresh token
  - `resetTokenSecret` - secret for reset token
  - `accessTokenExpirationTime` - the duration of access token. All duration should be in format as '40m'
  - `refreshTokenExpirationTime` - the duration of refresh token
  - `resetTokenExpirationTime` - the duration of reset token
  - `MAIL_HOST` - mail host
  - `MAIL_USER` - mail user
  - `MAIL_PASSWORD` - mail password
  - `MAIL_FROM` - mail from
- run `npm run start:dev` on backend folder
- run `ng serve -o` on frontend folder

#### Enjoy
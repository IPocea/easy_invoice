// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  baseUrl: 'http://localhost:3330/api/',
  pageSizeOptions: [10, 25, 50, 100],
  contractModels: {
    acceptedFields: [
      '{nume-furnizor}',
      '{J-furnizor}',
      '{CUI-furnizor}',
      '{sediu-furnizor}',
      '{judet-furnizor}',
      '{cont-bancar-furnizor}',
      '{banca-furnizor}',
      '{email-furnizor}',
      '{telefon-furnizor}',
      '{nume-client}',
      '{delegat-furnizor}',
      '{J/Serie-client}',
      '{CUI/CNP-client}',
      '{sediu-client}',
      '{judet-client}',
      '{cont-bancar-client}',
      '{banca-client}',
      '{email-client}',
      '{telefon-client}',
      '{numar-contract}',
      '{data-contract}',
      '{obiect-contract}',
      '{produse-contract}',
      '{valoare-contract}',
      '{avans-contract}',
      '{rest-plata-contract}',
      '{metoda-plata-contract}',
      '{transport-contract}',
      '{montaj-contract}',
      '{termen-livrare-contract}',
    ],
    mandatoryFields: [
      '{nume-furnizor}',
      '{J-furnizor}',
      '{CUI-furnizor}',
      '{sediu-furnizor}',
      '{judet-furnizor}',
      '{nume-client}',
      '{J/Serie-client}',
      '{CUI/CNP-client}',
      '{sediu-client}',
      '{judet-client}',
      '{numar-contract}',
      '{data-contract}',
      '{obiect-contract}',
    ],
  },
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.

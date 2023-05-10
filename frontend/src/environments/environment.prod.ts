export const environment = {
  production: true,
  baseUrl: 'https://easy-invoice-simple.herokuapp.com/api/',
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
      '{delegat-furnizor}',
      '{nume-client}',
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

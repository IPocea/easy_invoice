import { FormArray, FormGroup } from '@angular/forms';

export function cleanForm(formGroup: FormGroup): void {
  Object.keys(formGroup.controls).forEach((key) => {
    if (
      formGroup.get(key).value &&
      typeof formGroup.get(key).value === 'string'
    ) {
      return formGroup.get(key).setValue(formGroup.get(key).value?.trim());
    }
  });
}

export function getPasswordToolTip(): string {
  return 'Parola trebue sa contina cel putin 8 caractere, macar o litera mica, o litera mare, un numar si un caracter special.';
}

export function getUsernameToolTip(): string {
  return 'Username-ul trebuie sa aiba minim 6 caractere si poate contine literele, cifrele, punctul, cratima si underscore';
}

export function findInvalidControls(formGroup: FormGroup | FormArray): FormGroup["controls"][] {
  const invalid = [];
  const controls = formGroup.controls;
  for (const name in controls) {
    if (controls[name].invalid) {
      invalid.push(name);
    }
  }
  return invalid;
}

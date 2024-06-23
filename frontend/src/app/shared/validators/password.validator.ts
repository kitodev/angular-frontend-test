import { AbstractControl, ValidatorFn, ValidationErrors } from '@angular/forms';

export function passwordValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null;
    }

    const minLength = control.value.length >= 8;
    const hasUpperCase = /[A-Z]/.test(control.value);
    const hasLowerCase = /[a-z]/.test(control.value);
    const hasNumber = /[0-9]/.test(control.value);

    if (!minLength) {
      return { PASSWORD_MIN_LENGTH: true };
    }

    if (!hasUpperCase) {
      return { PASSWORD_HAS_UPPERCASE: true };
    }

    if (!hasLowerCase) {
      return { PASSWORD_HAS_LOWERCASE: true };
    }

    if (!hasNumber) {
      return { PASSWORD_HAS_NUMBER: true };
    }

    return null;
  };
}

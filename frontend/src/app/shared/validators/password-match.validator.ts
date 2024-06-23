import { ValidationErrors } from '@angular/forms';
import { FormGroup } from '@ngneat/reactive-forms';

export function passwordMatchValidator(formGroup: FormGroup<any>): ValidationErrors | null {
  const passwordControl = formGroup.get('password');
  const confirmPasswordControl = formGroup.get('confirmPassword');

  if (passwordControl.value !== confirmPasswordControl.value) {
    confirmPasswordControl.setErrors({ PASSWORD_MISMATCH: true });
  } else {
    confirmPasswordControl.setErrors(null);
  }

  return null;
}

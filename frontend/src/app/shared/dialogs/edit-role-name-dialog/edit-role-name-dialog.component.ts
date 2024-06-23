import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TRole, TUpdateRole } from '@api/models/role.model';
import { ControlsOf, FormControl, FormGroup } from '@ngneat/reactive-forms';

type TEditRoleNameForm = Pick<TRole, 'name'>;

@Component({
  selector: 'app-edit-role-name-dialog',
  standalone: true,
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  templateUrl: './edit-role-name-dialog.component.html',
  styleUrl: './edit-role-name-dialog.component.scss',
})
export class EditRoleNameDialogComponent {
  private _dialogRef = inject(MatDialogRef) as MatDialogRef<EditRoleNameDialogComponent, TUpdateRole>;
  private _dialogData = inject(MAT_DIALOG_DATA) as TRole;

  public editRoleNameForm = new FormGroup<ControlsOf<TEditRoleNameForm>>({
    name: new FormControl<string>(this._dialogData.name, Validators.required),
  });

  public submit(): void {
    this._dialogRef.close({
      id: this._dialogData.id,
      ...this.editRoleNameForm.value,
    });
  }
}

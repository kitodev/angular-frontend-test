import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TComment, TCreateComment } from '@api/models/topic.model';
import { AppState } from '@core/store/states/app/app.state';
import { ControlsOf, FormGroup, FormControl } from '@ngneat/reactive-forms';
import { Store } from '@ngxs/store';

type TAddCommentForm = Omit<TComment, 'id' | 'comments' | 'author'>;

@Component({
  selector: 'app-add-comment-dialog',
  standalone: true,
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  templateUrl: './add-comment-dialog.component.html',
  styleUrl: './add-comment-dialog.component.scss',
})
export class AddCommentDialogComponent {
  private _dialogRef = inject(MatDialogRef) as MatDialogRef<AddCommentDialogComponent, TCreateComment>;
  private _store = inject(Store);

  public $currentUser = toSignal(this._store.select(AppState.getCurrentUser));

  public addCommentForm = new FormGroup<ControlsOf<TAddCommentForm>>({
    body: new FormControl<string>('', Validators.required),
  });

  public submit(): void {
    const currentUser = this.$currentUser()!;

    this._dialogRef.close({
      ...this.addCommentForm.value,
      author: currentUser,
    });
  }
}

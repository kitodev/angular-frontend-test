import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { TUser } from '@api/models/user.model';
import { AppState } from '@core/store/states/app/app.state';
import { ControlsOf, FormControl, FormGroup } from '@ngneat/reactive-forms';
import { Store } from '@ngxs/store';
import { passwordValidator } from '@shared/validators/password.validator';
import { passwordMatchValidator } from '@shared/validators/password-match.validator';
import { AppActions } from '@core/store/states/app/app.actions';
import { ToastrService } from 'ngx-toastr';
import { map } from 'rxjs';
import { NgClass } from '@angular/common';

type TEditProfileForm = Pick<TUser, 'name' | 'email' | 'password'> & {
  confirmPassword: string;
};

type TPasswordVisibility = 'password' | 'confirm-password';

@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [NgClass, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule],
  templateUrl: './profile-page.component.html',
  styleUrl: './profile-page.component.scss',
})
export class ProfilePageComponent implements OnInit {
  private _store = inject(Store);
  private _destroyRef = inject(DestroyRef);
  private _toastrService = inject(ToastrService);

  private _currentUser$ = this._store.select(AppState.getCurrentUser);
  private _$currentUser = toSignal(this._currentUser$);

  public $currentUserPermissions = toSignal(
    this._store.select(AppState.getCurrentUserPermissions).pipe(map((permissions) => Object.entries(permissions)))
  );

  public $currentUserTopicsCount = toSignal(this._store.select(AppState.getCurrentUserTopicsCount));
  public $currentUserCommentsCount = toSignal(this._store.select(AppState.getCurrentUserCommentsCount));

  public editProfileForm = new FormGroup<ControlsOf<TEditProfileForm>>(
    {
      name: new FormControl('', [Validators.required, Validators.minLength(5)]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', passwordValidator()),
      confirmPassword: new FormControl(''),
    },
    { validators: passwordMatchValidator as any }
  );

  public isPasswordHidden = true;
  public isConfirmPasswordHidden = true;

  ngOnInit(): void {
    this._currentUser$.pipe(takeUntilDestroyed(this._destroyRef)).subscribe({
      next: (currentUser) => {
        this._initForm(currentUser!);
      },
    });
  }

  public togglePasswordVisibility(type: TPasswordVisibility): void {
    if (type === 'password') {
      this.isPasswordHidden = !this.isPasswordHidden;
    } else {
      this.isConfirmPasswordHidden = !this.isConfirmPasswordHidden;
    }
  }

  public editProfile(): void {
    const currentUser = this._$currentUser()!;
    currentUser.name = this.editProfileForm.controls.name.value;
    currentUser.email = this.editProfileForm.controls.email.value;

    const hasPasswordChange =
      this.editProfileForm.controls.password.value &&
      this.editProfileForm.controls.confirmPassword.value &&
      this.editProfileForm.controls.password.value === this.editProfileForm.controls.confirmPassword.value;

    this._store
      .dispatch([
        new AppActions.UpdateUser(currentUser),
        new AppActions.UpdatePassword({
          user: currentUser,
          password: hasPasswordChange ? this.editProfileForm.controls.password.value : currentUser.password,
          confirmPassword: hasPasswordChange
            ? this.editProfileForm.controls.confirmPassword.value
            : currentUser.password,
        }),
      ])
      .subscribe({
        next: () => {
          this._toastrService.success('User edited successfully');
        },
        error: () => {
          this._toastrService.error('Operation failed: Edit user');
        },
      });
  }

  private _initForm(currentUser: TUser): void {
    this.editProfileForm.setValue({
      name: currentUser.name,
      email: currentUser.email,
      password: '',
      confirmPassword: '',
    });
  }
}

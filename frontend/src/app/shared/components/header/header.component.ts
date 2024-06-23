import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatInputModule } from '@angular/material/input';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { TitleService } from '@core/services/title/title.service';
import { Store } from '@ngxs/store';
import { AppState } from '@core/store/states/app/app.state';
import { AppActions } from '@core/store/states/app/app.actions';
import { compareEntitiesById } from '../../helpers/compare-entities';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, MatToolbarModule, MatInputModule, MatSelectModule, MatFormFieldModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  private _store = inject(Store);
  private _titleService = inject(TitleService);

  public $title = this._titleService.$title;
  public $users = toSignal(this._store.select(AppState.getUsers));
  public $currentUser = toSignal(this._store.select(AppState.getCurrentUser));

  public compareEntitiesById = compareEntitiesById;

  public changeUser(event: MatSelectChange): void {
    this._store.dispatch(new AppActions.ChangeUser(event.value));
  }
}

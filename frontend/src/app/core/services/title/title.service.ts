import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TitleService {
  private _$title = signal('');
  public $title = this._$title.asReadonly();

  public changeTitle(newTitle: string) {
    this._$title.set(newTitle);
  }
}

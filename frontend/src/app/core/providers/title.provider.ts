import { EnvironmentProviders, Injectable, makeEnvironmentProviders } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterStateSnapshot, TitleStrategy } from '@angular/router';
import { TitleService } from '@core/services/title/title.service';

@Injectable({ providedIn: 'root' })
class PageTitleStrategy extends TitleStrategy {
  constructor(
    private _title: Title,
    private _titleService: TitleService
  ) {
    super();
  }

  override updateTitle(routerState: RouterStateSnapshot) {
    const title = this.buildTitle(routerState);

    if (title !== undefined) {
      this._title.setTitle(`Dynata FE - ${title}`);
      this._titleService.changeTitle(title);
    }
  }
}

export const provideTitleStrategy = (): EnvironmentProviders =>
  makeEnvironmentProviders([
    {
      provide: TitleStrategy,
      useClass: PageTitleStrategy,
    },
  ]);

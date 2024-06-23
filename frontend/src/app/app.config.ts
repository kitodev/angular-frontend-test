import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { NgxsModule } from '@ngxs/store';
import { NgxsStoragePluginModule, StorageOption } from '@ngxs/storage-plugin';
import { AppState } from '@core/store/states/app/app.state';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideToastr } from 'ngx-toastr';
import { provideTitleStrategy } from '@core/providers/title.provider';
import { provideAppInitializers } from './app-initializer';
import { APP_ROUTES } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(),
    provideTitleStrategy(),
    provideRouter(APP_ROUTES),
    provideAppInitializers(),
    provideAnimationsAsync(),
    provideToastr({
      timeOut: 3000,
      maxOpened: 1,
      autoDismiss: true,
      positionClass: 'toast-bottom-right',
    }),
    importProvidersFrom([
      NgxsModule.forRoot([AppState]),
      NgxsStoragePluginModule.forRoot({
        key: [AppState.STATE_KEY],
        storage: StorageOption.SessionStorage,
      }),
    ]),
  ],
};

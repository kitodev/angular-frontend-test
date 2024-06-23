import { APP_INITIALIZER, FactoryProvider } from '@angular/core';
import { ApiService } from '@core/services/api/api.service';
import { AppActions } from '@core/store/states/app/app.actions';
import { Store } from '@ngxs/store';

const initStore = (apiService: ApiService, store: Store) => () =>
  new Promise((resolve) => {
    apiService.init().subscribe({
      next: (initData) => {
        resolve(store.dispatch(new AppActions.InitStore(initData)));
      },
    });
  });

export const STORE_INITIALIZER: FactoryProvider = {
  provide: APP_INITIALIZER,
  useFactory: initStore,
  multi: true,
  deps: [ApiService, Store],
};

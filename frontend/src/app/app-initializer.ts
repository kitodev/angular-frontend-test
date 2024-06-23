import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { STORE_INITIALIZER } from '@core/initializers/store.initializer';

export const provideAppInitializers = (): EnvironmentProviders => makeEnvironmentProviders([STORE_INITIALIZER]);

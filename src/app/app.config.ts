import { ApplicationConfig, provideBrowserGlobalErrorListeners,importProvidersFrom  } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { provideToastr } from 'ngx-toastr';
import { NgxDaterangepickerBootstrapModule } from "ngx-daterangepicker-bootstrap";

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(),
    importProvidersFrom(NgxDaterangepickerBootstrapModule.forRoot({
      separator: ' - ',
      applyLabel: 'Okay',
    })),
    provideToastr({
        timeOut: 3000,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
    })
  ]
};

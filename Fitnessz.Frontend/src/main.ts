import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from '@features/forum/components/app';

bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));

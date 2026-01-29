import { Routes } from '@angular/router';
import {TopicPage} from '@features/forum/components/topic.component';
import {App} from '@features/forum/components/app';

export const routes: Routes = [
  { path: '', component: App},
  {path: 'forum', component: TopicPage}
];

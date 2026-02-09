import { Routes } from '@angular/router';
import {App} from './app';
import {Explore} from './community-pages/explore';
import {Categories} from './community-pages/Categories';
import {Fullthread} from './community-pages/fullthread/fullthread';
import {Login} from './login-pages/login';




export const routes: Routes = [
  { path: '', component: Explore},
  { path: 'kategoria/:id', component: Categories},
  { path: 'egeszthread/:id', component: Fullthread},
  {path: 'bejelentkezes', component: Login}
];

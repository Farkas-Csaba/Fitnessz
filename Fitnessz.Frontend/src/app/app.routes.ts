import { Routes } from '@angular/router';
import {App} from './app';
import {Explore} from './community-pages/explore';
import {Categories} from './community-pages/Categories';
import {Fullthread} from './community-pages/full-thread/fullthread';
import {Login} from './login-pages/login';
import {Register} from './login-pages/register';
import {CreateThread} from './community-pages/create-thread/create-thread';
import {authGuard} from './login-pages-service/auth-guard';


export const routes: Routes = [
  { path: '', component: Explore},
  { path: 'kategoria/:id', component: Categories},
  { path: 'egeszthread/:id', component: Fullthread},
  { path: 'bejelentkezes', component: Login},
  { path: 'regisztralas', component: Register},
  { path: 'posztolas', component: CreateThread, canActivate: [authGuard]}
];

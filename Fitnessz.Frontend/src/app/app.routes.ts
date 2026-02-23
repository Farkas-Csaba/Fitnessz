import { Routes } from '@angular/router';
import {App} from './app';
import {Explore} from './community-pages/explore';
import {Categories} from './community-pages/Categories';
import {Fullthread} from './community-pages/full-thread/fullthread';
import {Login} from './login-pages/login';
import {Register} from './login-pages/register';
import {CreateThread} from './community-pages/create-thread/create-thread';
import {authGuard} from './guards/auth-guard';
import {EditThread} from './community-pages/edit-thread/edit-thread';
import {editGuard} from './guards/edit-guard';
import {RenderMode} from '@angular/ssr';


export const routes: Routes = [
  { path: '', component: Explore},
  { path: 'kategoria/:id',component: Categories,},
  { path: 'egeszthread/:id', component: Fullthread},
  { path: 'bejelentkezes', component: Login},
  { path: 'regisztralas', component: Register},
  { path: 'posztolas', component: CreateThread, canActivate: [authGuard]},
  { path: 'posztszerkesztes/:id', component: EditThread, canActivate: [authGuard, editGuard]}
];

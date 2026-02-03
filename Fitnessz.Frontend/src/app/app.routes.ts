import { Routes } from '@angular/router';
import {App} from './app';
import {Felfedezes} from './community-pages/felfedezes';
import {Taplalekkiegeszitok} from './community-pages/taplalekkiegeszitok';
import {Fizikum} from './community-pages/fizikum';
import {Etkezes} from './community-pages/etkezes';
import {Edzesterv} from './community-pages/edzesterv';



export const routes: Routes = [
  { path: '', component: Felfedezes},
  { path: 'tema/taplalekkiegeszitok', component: Taplalekkiegeszitok},
  { path: 'tema/fizikum', component: Fizikum},
  { path: 'tema/etkezes', component: Etkezes},
  {path: 'tema/edzesterv', component: Edzesterv}
];

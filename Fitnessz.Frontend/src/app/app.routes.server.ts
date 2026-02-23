import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'kategoria/:id',
    renderMode: RenderMode.Client
  },
  {
    path: 'posztszerkesztes/:id',
    renderMode: RenderMode.Client
  },
  {
    path: 'egeszthread/:id',
    renderMode: RenderMode.Client
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender
  }
];

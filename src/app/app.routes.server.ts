import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: '',
    renderMode: RenderMode.Prerender,
  },
  {
    path: 'tags',
    renderMode: RenderMode.Server,
  },
  {
    path: 'posts',
    renderMode: RenderMode.Server,
  },
  {
    path: 'posts/:slug',
    renderMode: RenderMode.Server,
  },
];

import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { RenderMode, ServerRoute } from '@angular/ssr';
import { lastValueFrom, take } from 'rxjs';
import { PostPreviewDto } from '../models/post-preview-dto';
import { TagDto } from '../models/tag-dto';

export const serverRoutes: ServerRoute[] = [
  {
    path: '',
    renderMode: RenderMode.Prerender,
  },
  {
    path: 'tags',
    renderMode: RenderMode.Prerender,
  },
  {
    path: 'posts/:slug',
    renderMode: RenderMode.Server,
  },
];

import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { RenderMode, ServerRoute } from '@angular/ssr';
import { PostPreview } from '../models/post-preview';
import { lastValueFrom, take } from 'rxjs';

export const serverRoutes: ServerRoute[] = [
  {
    path: '**',
    renderMode: RenderMode.Prerender,
    async getPrerenderParams() {
      const http = inject(HttpClient);
      const request = http.get<PostPreview[]>('/api/posts').pipe(take(1));
      const posts = await lastValueFrom(request);
      return posts.map((post) => ({
        year: String(post.year).padStart(4, '0'),
        month: String(post.month).padStart(2, '0'),
        filename: post.filename,
      }));
      return [];
    },
  },
];

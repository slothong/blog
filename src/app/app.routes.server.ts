import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { RenderMode, ServerRoute } from '@angular/ssr';
import { lastValueFrom, take } from 'rxjs';
import { PostPreviewDto } from '../models/post-preview-dto';

export const serverRoutes: ServerRoute[] = [
  {
    path: '**',
    renderMode: RenderMode.Prerender,
    async getPrerenderParams() {
      const http = inject(HttpClient);
      const request = http.get<PostPreviewDto[]>('/api/posts').pipe(take(1));
      const posts = await lastValueFrom(request);
      return posts.map((post) => {
        const slug = post.slug;
        return {
          slug,
        };
      });
    },
  },
];

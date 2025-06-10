import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { RenderMode, ServerRoute } from '@angular/ssr';
import { lastValueFrom, take } from 'rxjs';
import { PostPreviewDto } from '../models/post-preview';

export const serverRoutes: ServerRoute[] = [
  {
    path: '**',
    renderMode: RenderMode.Prerender,
    async getPrerenderParams() {
      const http = inject(HttpClient);
      const request = http.get<PostPreviewDto[]>('/api/posts').pipe(take(1));
      const posts = await lastValueFrom(request);
      return posts.map((post) => {
        const date = new Date(post.date);
        const slug = post.slug;
        return {
          year: date.getFullYear().toString(),
          month: (date.getMonth() + 1).toString().padStart(2, '0'),
          slug,
        };
      });
      //  ({

      //   year: String(post.year).padStart(4, '0'),
      //   month: String(post.month).padStart(2, '0'),
      //   filename: post.filename,
      // }));
      return [];
    },
  },
];

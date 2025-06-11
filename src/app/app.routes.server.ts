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
    path: 'posts',
    renderMode: RenderMode.Prerender,
  },
  {
    path: 'posts/:slug',
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
  {
    path: 'tags',
    renderMode: RenderMode.Prerender,
  },
  {
    path: 'tags/:tag',
    renderMode: RenderMode.Prerender,
    async getPrerenderParams() {
      const http = inject(HttpClient);
      const request = http.get<TagDto[]>('/api/tags').pipe(take(1));
      const tags = await lastValueFrom(request);
      return tags.map((tag) => {
        return {
          tag: tag.name,
        };
      });
    },
  },
];

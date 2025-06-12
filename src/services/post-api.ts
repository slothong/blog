import { map } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PostPreviewDto } from '@/models/post-preview-dto';
import { PostPreview } from '@/models/post-preview';
import { PostDto } from '@/models/post-dto';
import { Post } from '@/models/post';

@Injectable({
  providedIn: 'root',
})
export class PostApi {
  constructor(private http: HttpClient) {}

  getPost(slug: string) {
    return this.http
      .get<PostDto>(`/api/posts/${slug}`)
      .pipe(map((dto) => Post.fromDto(dto)));
  }

  getPosts(tag?: string) {
    const options = tag ? { params: new HttpParams().set('tag', tag) } : {};
    return this.http
      .get<PostPreviewDto[]>('/api/posts', options)
      .pipe(map((dtos) => dtos.map((dto) => PostPreview.fromDto(dto))));
  }
}

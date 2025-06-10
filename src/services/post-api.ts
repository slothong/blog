import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { PostPreviewDto } from '../models/post-preview-dto';
import { PostPreview } from '../models/post-preview';

@Injectable({
  providedIn: 'root',
})
export class PostApi {
  constructor(private http: HttpClient) {}

  getPosts(tag?: string) {
    const options = tag ? { params: new HttpParams().set('tag', tag) } : {};
    return this.http
      .get<PostPreviewDto[]>('/api/posts', options)
      .pipe(map((dtos) => dtos.map((dto) => PostPreview.fromDto(dto))));
  }
}

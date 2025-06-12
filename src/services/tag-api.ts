import { map } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TagDto } from '@/models/tag-dto';
import { Tag } from '@/models/tag';

@Injectable({
  providedIn: 'root',
})
export class TagApi {
  constructor(private http: HttpClient) {}

  getTags() {
    return this.http
      .get<TagDto[]>('/api/tags')
      .pipe(map((dtos) => dtos.map((dto) => Tag.fromDto(dto))));
  }
}

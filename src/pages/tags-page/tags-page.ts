import { HttpClient } from '@angular/common/http';
import { Component, signal } from '@angular/core';
import { TagDto } from '../../models/tag-dto';
import { Tag } from '../../models/tag';

@Component({
  selector: 'app-tags-page',
  templateUrl: './tags-page.html',
  styleUrl: './tags-page.scss',
})
export class TagsPageComponent {
  protected readonly tags = signal<Tag[]>([]);

  constructor(private http: HttpClient) {
    this.http.get<TagDto[]>('/api/tags').subscribe((dtos) => {
      this.tags.set(dtos.map((dto) => Tag.fromDto(dto)));
    });
  }
}

import { HttpClient } from '@angular/common/http';
import { Component, OnInit, signal } from '@angular/core';
import { TagDto } from '../../models/tag-dto';
import { Tag } from '../../models/tag';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-tags-page',
  templateUrl: './tags-page.html',
  styleUrl: './tags-page.scss',
})
export class TagsPageComponent implements OnInit {
  protected readonly tags = signal<Tag[]>([]);

  constructor(private http: HttpClient, private title: Title) {
    this.http.get<TagDto[]>('/api/tags').subscribe((dtos) => {
      this.tags.set(dtos.map((dto) => Tag.fromDto(dto)));
    });
  }

  ngOnInit() {
    this.title.setTitle('Tags - Slothong');
  }
}

import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { TagApi } from '@/services/tag-api';
import { Tag } from '@/models/tag';
import { PageLayoutComponent } from '@/components/page-layout/page-layout';

@Component({
  selector: 'app-tags-page',
  templateUrl: './tags-page.html',
  styleUrl: './tags-page.scss',
  imports: [CommonModule, PageLayoutComponent],
})
export class TagsPageComponent implements OnInit {
  protected readonly tags$: Observable<Tag[]>;

  constructor(private tagApi: TagApi, private title: Title) {
    this.tags$ = this.tagApi.getTags();
  }

  ngOnInit() {
    this.title.setTitle('Tags - Slothong');
  }
}

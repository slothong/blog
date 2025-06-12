import { Component, OnInit } from '@angular/core';
import { Tag } from '../../models/tag';
import { Title } from '@angular/platform-browser';
import { Observable } from 'rxjs';
import { TagApi } from '../../services/tag-api';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tags-page',
  templateUrl: './tags-page.html',
  styleUrl: './tags-page.scss',
  imports: [CommonModule],
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

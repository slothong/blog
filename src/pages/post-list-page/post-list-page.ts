import { Observable, switchMap } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';
import { PostListComponent } from '@/components/post-list/post-list';
import { PostApi } from '@/services/post-api';
import { PostPreview } from '@/models/post-preview';

@Component({
  selector: 'app-post-list-page',
  templateUrl: './post-list-page.html',
  imports: [PostListComponent, CommonModule],
})
export class PostListPageComponent implements OnInit {
  protected readonly posts$: Observable<PostPreview[]>;

  constructor(
    private route: ActivatedRoute,
    private postApi: PostApi,
    private meta: Meta,
    private title: Title
  ) {
    this.posts$ = this.route.queryParamMap.pipe(
      switchMap(() => this.postApi.getPosts())
    );
  }

  ngOnInit() {
    this.title.setTitle('Posts - Slothong');
  }
}

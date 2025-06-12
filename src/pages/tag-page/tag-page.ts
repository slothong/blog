import { Component, OnDestroy, OnInit } from '@angular/core';
import { PostListComponent } from '../../components/post-list/post-list';
import { PostApi } from '../../services/post-api';
import { filter, map, Observable, Subject, switchMap, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { PostPreview } from '../../models/post-preview';
import { ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-tag-page',
  templateUrl: './tag-page.html',
  styleUrl: './tag-page.scss',
  imports: [PostListComponent, CommonModule],
})
export class TagPageComponent implements OnInit, OnDestroy {
  protected readonly posts$: Observable<PostPreview[]>;
  protected readonly tag$: Observable<string | null>;
  private readonly destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private postApi: PostApi,
    private title: Title
  ) {
    this.tag$ = this.route.paramMap.pipe(map((params) => params.get('tag')));

    this.posts$ = this.tag$.pipe(
      filter((tag): tag is string => !!tag),
      switchMap((tag) => this.postApi.getPosts(tag))
    );
  }

  ngOnInit() {
    this.tag$.pipe(takeUntil(this.destroy$)).subscribe((tag) => {
      this.title.setTitle('Tag: ' + tag + ' - Slothong');
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

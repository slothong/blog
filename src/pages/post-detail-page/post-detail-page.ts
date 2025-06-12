import { filter, map, Observable, Subject, switchMap, takeUntil } from 'rxjs';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Title } from '@angular/platform-browser';
import { Post } from '../../models/post';
import { PostDetailComponent } from '../../components/post-detail/post-detail';
import { PostApi } from '../../services/post-api';

@Component({
  selector: 'app-post-detail-page',
  templateUrl: './post-detail-page.html',
  imports: [PostDetailComponent, CommonModule],
})
export class PostDetailPageComponent implements OnInit, OnDestroy {
  protected readonly post$: Observable<Post>;
  private readonly destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private postApi: PostApi,
    private title: Title
  ) {
    this.post$ = this.route.paramMap.pipe(
      map((params) => params.get('slug')),
      filter((slug): slug is string => slug != null),
      switchMap((slug) => this.postApi.getPost(slug))
    );
  }

  ngOnInit() {
    this.post$.pipe(takeUntil(this.destroy$)).subscribe((post) => {
      this.title.setTitle(post.title);
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

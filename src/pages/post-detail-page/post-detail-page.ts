import { filter, map, Observable, Subject, switchMap, takeUntil } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Component, effect, OnDestroy, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PostDto } from '../../models/post-dto';
import { Post } from '../../models/post';
import { PostDetailComponent } from '../../components/post-detail/post-detail';
import { Title } from '@angular/platform-browser';

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
    private http: HttpClient,
    private title: Title
  ) {
    this.post$ = this.route.paramMap.pipe(
      map((params) => params.get('slug')),
      filter((slug): slug is string => slug != null),
      switchMap((slug) => this.http.get<PostDto>(`/api/posts/${slug}`)),
      map((postDto) => Post.fromDto(postDto))
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

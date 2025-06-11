import { Component } from '@angular/core';
import { PostListComponent } from '../../components/post-list/post-list';
import { PostApi } from '../../services/post-api';
import { filter, map, Observable, switchMap } from 'rxjs';
import { CommonModule } from '@angular/common';
import { PostPreview } from '../../models/post-preview';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-tag-page',
  templateUrl: './tag-page.html',
  styleUrl: './tag-page.scss',
  imports: [PostListComponent, CommonModule],
})
export class TagPageComponent {
  protected readonly posts$: Observable<PostPreview[]>;

  constructor(private route: ActivatedRoute, private postApi: PostApi) {
    this.posts$ = this.route.paramMap.pipe(
      map((params) => params.get('tag')),
      filter((tag): tag is string => !!tag),
      switchMap((tag) => this.postApi.getPosts(tag))
    );
  }
}

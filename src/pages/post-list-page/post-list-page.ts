import { Component } from '@angular/core';
import { PostListComponent } from '../../components/post-list/post-list';
import { PostApi } from '../../services/post-api';
import { map, Observable, switchMap } from 'rxjs';
import { CommonModule } from '@angular/common';
import { PostPreview } from '../../models/post-preview';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-post-list-page',
  templateUrl: './post-list-page.html',
  styleUrl: './post-list-page.scss',
  imports: [PostListComponent, CommonModule],
})
export class PostListPageComponent {
  protected readonly posts$: Observable<PostPreview[]>;

  constructor(private route: ActivatedRoute, private postApi: PostApi) {
    this.posts$ = this.route.queryParamMap.pipe(
      map((params) => params.get('tag')),
      switchMap((tag) => {
        return tag ? this.postApi.getPosts(tag) : this.postApi.getPosts();
      })
    );
  }
}

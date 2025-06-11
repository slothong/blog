import { Component } from '@angular/core';
import { Observable, switchMap } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { PostListComponent } from '../../components/post-list/post-list';
import { PostApi } from '../../services/post-api';
import { PostPreview } from '../../models/post-preview';

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
      switchMap(() => this.postApi.getPosts())
    );
  }
}

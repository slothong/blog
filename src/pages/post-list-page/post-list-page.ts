import { Component, signal } from '@angular/core';
import { PostPreviewDto } from '../../models/post-preview';
import { HttpClient } from '@angular/common/http';
import { PostListComponent } from '../../components/post-list/post-list';

@Component({
  selector: 'app-post-list-page',
  templateUrl: './post-list-page.html',
  styleUrl: './post-list-page.scss',
  imports: [PostListComponent],
})
export class PostListPageComponent {
  protected readonly posts = signal<PostPreviewDto[]>([]);

  constructor(private http: HttpClient) {
    this.http.get<PostPreviewDto[]>('/api/posts').subscribe((posts) => {
      this.posts.set(posts);
    });
  }
}

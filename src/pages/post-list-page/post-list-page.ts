import { Component, signal } from '@angular/core';
import { PostPreview } from '../../models/post-preview';
import { HttpClient } from '@angular/common/http';
import { PostListComponent } from '../../components/post-list/post-list';

@Component({
  selector: 'app-post-list-page',
  templateUrl: './post-list-page.html',
  styleUrl: './post-list-page.scss',
  imports: [PostListComponent],
})
export class PostListPageComponent {
  protected readonly posts = signal<PostPreview[]>([]);

  constructor(private http: HttpClient) {
    this.http.get<PostPreview[]>('/api/posts').subscribe((posts) => {
      this.posts.set(posts);
    });
  }
}

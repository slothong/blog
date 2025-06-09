import { HttpClient } from '@angular/common/http';
import { Component, signal } from '@angular/core';
import { PostPreview } from '../../models/post-preview';
import { PostPreviewComponent } from '../post-preview/post-preview';

@Component({
  selector: 'app-post-list',
  templateUrl: 'post-list.html',
  styleUrl: 'post-list.scss',
  imports: [PostPreviewComponent],
})
export class PostListComponent {
  protected readonly posts = signal<PostPreview[]>([]);

  constructor(private http: HttpClient) {
    this.http.get<PostPreview[]>('/api/posts').subscribe((posts) => {
      this.posts.set(posts);
    });
  }
}

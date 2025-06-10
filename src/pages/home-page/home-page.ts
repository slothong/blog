import { Component, signal } from '@angular/core';
import { PostListComponent } from '../../components/post-list/post-list';
import { HttpClient } from '@angular/common/http';
import { PostPreviewDto } from '../../models/post-preview';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.html',
  styleUrl: './home-page.scss',
  imports: [PostListComponent],
})
export class HomePageComponent {
  protected readonly posts = signal<PostPreviewDto[]>([]);

  constructor(private http: HttpClient) {
    this.http.get<PostPreviewDto[]>('/api/posts').subscribe((posts) => {
      this.posts.set(posts);
    });
  }
}

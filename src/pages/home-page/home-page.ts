import { Observable } from 'rxjs';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { PostApi } from '@/services/post-api';
import { PostPreview } from '@/models/post-preview';
import { PostListComponent } from '@/components/post-list/post-list';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.html',
  imports: [PostListComponent, CommonModule],
})
export class HomePageComponent {
  protected readonly posts: Observable<PostPreview[]>;

  constructor(private http: HttpClient, private postApi: PostApi) {
    this.posts = this.postApi.getPosts();
  }
}

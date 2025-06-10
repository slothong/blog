import { Component, signal } from '@angular/core';
import { PostListComponent } from '../../components/post-list/post-list';
import { HttpClient } from '@angular/common/http';
import { PostApi } from '../../services/post-api';
import { Observable } from 'rxjs';
import { PostPreview } from '../../models/post-preview';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.html',
  styleUrl: './home-page.scss',
  imports: [PostListComponent, CommonModule],
})
export class HomePageComponent {
  protected readonly posts: Observable<PostPreview[]>;

  constructor(private http: HttpClient, private postApi: PostApi) {
    this.posts = this.postApi.getPosts();
  }
}

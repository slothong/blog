import { HttpClient } from '@angular/common/http';
import { Component, signal } from '@angular/core';
import { PostPreview } from '../../models/post-preview';
import { PostListComponent } from '../../components/post-list/post-list';

@Component({
  selector: 'app-home',
  templateUrl: './home.html',
  styleUrls: ['./home.scss'],
  imports: [PostListComponent],
})
export class HomeComponent {}

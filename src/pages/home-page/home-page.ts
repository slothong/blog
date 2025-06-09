import { Component, signal } from '@angular/core';
import { PostListComponent } from '../../components/post-list/post-list';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.html',
  styleUrls: ['./home-page.scss'],
  imports: [PostListComponent],
})
export class HomePageComponent {}

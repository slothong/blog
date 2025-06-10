import { Routes } from '@angular/router';
import { HomePageComponent } from '../pages/home-page/home-page';
import { PostDetailPageComponent } from '../pages/post-detail-page/post-detail-page';
import { PostListPageComponent } from '../pages/post-list-page/post-list-page';

export const routes: Routes = [
  {
    path: '',
    component: HomePageComponent,
  },
  {
    path: 'posts',
    component: PostListPageComponent,
  },
  {
    path: ':year/:month/:slug',
    component: PostDetailPageComponent,
  },
];

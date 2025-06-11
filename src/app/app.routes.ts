import { Routes } from '@angular/router';
import { HomePageComponent } from '../pages/home-page/home-page';
import { PostDetailPageComponent } from '../pages/post-detail-page/post-detail-page';
import { PostListPageComponent } from '../pages/post-list-page/post-list-page';
import { TagsPageComponent } from '../pages/tags-page/tags-page';
import { TagPageComponent } from '../pages/tag-page/tag-page';

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
    path: 'posts/:slug',
    component: PostDetailPageComponent,
  },
  {
    path: 'tags',
    component: TagsPageComponent,
  },
  {
    path: 'tags/:tag',
    component: TagPageComponent,
  },
];

import { Routes } from '@angular/router';
import { HomePageComponent } from '../pages/home-page/home-page';
import { PostDetailPageComponent } from '../pages/post-detail-page/post-detail-page';

export const routes: Routes = [
  {
    path: '',
    component: HomePageComponent,
  },
  {
    path: ':year/:month/:filename',
    component: PostDetailPageComponent,
  },
];

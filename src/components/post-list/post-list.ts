import { Component, input } from '@angular/core';
import { PostPreviewDto } from '../../models/post-preview-dto';
import { PostPreviewComponent } from '../post-preview/post-preview';

@Component({
  selector: 'app-post-list',
  templateUrl: 'post-list.html',
  styleUrl: 'post-list.scss',
  imports: [PostPreviewComponent],
})
export class PostListComponent {
  readonly posts = input<PostPreviewDto[]>([]);
}

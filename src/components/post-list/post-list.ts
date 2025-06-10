import { Component, input } from '@angular/core';
import { PostPreview } from '../../models/post-preview';
import { PostPreviewComponent } from '../post-preview/post-preview';

@Component({
  selector: 'app-post-list',
  templateUrl: 'post-list.html',
  styleUrl: 'post-list.scss',
  imports: [PostPreviewComponent],
})
export class PostListComponent {
  readonly posts = input<PostPreview[]>([]);
}

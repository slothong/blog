import { Component, input } from '@angular/core';
import { Post } from '@/models/post';
import { MarkdownViewerComponent } from '@/components//markdown-viewer/markdown-viewer';

@Component({
  selector: 'app-post-detail',
  templateUrl: './post-detail.html',
  styleUrl: './post-detail.scss',
  imports: [MarkdownViewerComponent],
})
export class PostDetailComponent {
  readonly post = input<Post>();
}

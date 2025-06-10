import { Component, computed, input } from '@angular/core';
import { PostPreviewDto } from '../../models/post-preview-dto';

@Component({
  selector: 'app-post-preview',
  templateUrl: './post-preview.html',
  styleUrl: './post-preview.scss',
})
export class PostPreviewComponent {
  readonly postPreview = input<PostPreviewDto>();

  protected readonly link = computed<string | null>(() => {
    const postPreview = this.postPreview();
    if (postPreview == null) return null;
    return `/posts/${postPreview.slug}`;
  });
}

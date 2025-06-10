import { Component, computed, input } from '@angular/core';
import { PostPreviewDto } from '../../models/post-preview';

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
    const date = new Date(postPreview.date);
    const year = String(date.getFullYear()).padStart(4, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    return `${year}/${month}/${postPreview.slug}`;
  });
}

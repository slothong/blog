import { Component, computed, input } from '@angular/core';
import { marked } from 'marked';

@Component({
  selector: 'app-markdown-viewer',
  templateUrl: './markdown-viewer.html',
})
export class MarkdownViewerComponent {
  readonly markdown = input<string>();

  protected readonly html = computed(() => {
    return marked.parse(this.markdown() ?? '');
  });
}

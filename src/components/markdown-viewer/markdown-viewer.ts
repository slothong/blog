import { Component, computed, input } from '@angular/core';
import { Marked } from 'marked';
import { markedHighlight } from 'marked-highlight';
import hljs from 'highlight.js';

@Component({
  selector: 'app-markdown-viewer',
  templateUrl: './markdown-viewer.html',
})
export class MarkdownViewerComponent {
  readonly markdown = input<string>();

  private readonly marked = new Marked(
    markedHighlight({
      emptyLangClass: 'hljs',
      langPrefix: 'hljs language-',
      highlight(code, lang, info) {
        const language = hljs.getLanguage(lang) ? lang : 'plaintext';
        const value = hljs.highlight(code, { language }).value;
        console.log(value);
        return value;
      },
    })
  );

  protected readonly html = computed(() => {
    return this.marked.parse(this.markdown() ?? '');
  });
}

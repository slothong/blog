import { Component, computed, input } from '@angular/core';
import { Marked } from 'marked';
import { markedHighlight } from 'marked-highlight';
import hljs from 'highlight.js';

// TODO: hljs 등록할 언어 선택해서 번들 사이즈 줄이기
@Component({
  selector: 'app-markdown-viewer',
  templateUrl: './markdown-viewer.html',
  styleUrl: './markdown-viewer.scss',
})
export class MarkdownViewerComponent {
  readonly markdown = input<string>();

  private readonly marked = new Marked(
    markedHighlight({
      emptyLangClass: 'hljs',
      langPrefix: 'hljs language-',
      highlight(code, lang, info) {
        const language = hljs.getLanguage(lang) ? lang : 'plaintext';
        return hljs.highlight(code, { language }).value;
      },
    })
  );

  protected readonly html = computed(() => {
    return this.marked.parse(this.markdown() ?? '');
  });
}

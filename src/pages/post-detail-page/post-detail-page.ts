import { HttpClient } from '@angular/common/http';
import { Component, effect, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MarkdownViewerComponent } from '../../components/markdown-viewer/markdown-viewer';

@Component({
  selector: 'app-post-detail-page',
  styleUrl: './post-detail-page.scss',
  templateUrl: './post-detail-page.html',
  imports: [MarkdownViewerComponent],
})
export class PostDetailPageComponent implements OnInit {
  readonly url = signal<string | null>(null);
  readonly postContent = signal<string | null>(null);

  constructor(private route: ActivatedRoute, private http: HttpClient) {
    effect(() => {
      const url = this.url();
      if (url) {
        this.http.get<string>(`/api/posts/${url}`).subscribe({
          next: (data) => {
            this.postContent.set(data);
          },
          error: (err) => {
            console.error(err);
          },
        });
      }
    });
  }

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      const year = params.get('year')!;
      const month = params.get('month')!;
      const slug = params.get('slug')!;
      this.url.set(`${year}/${month}/${slug}`);
    });
  }
}

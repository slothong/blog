import { HttpClient } from '@angular/common/http';
import { Component, effect, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MarkdownViewerComponent } from '../../components/markdown-viewer/markdown-viewer';
import { PostDto } from '../../models/post-dto';

@Component({
  selector: 'app-post-detail-page',
  styleUrl: './post-detail-page.scss',
  templateUrl: './post-detail-page.html',
  imports: [MarkdownViewerComponent],
})
export class PostDetailPageComponent implements OnInit {
  readonly slug = signal<string | null>(null);
  readonly postContent = signal<string | null>(null);

  constructor(private route: ActivatedRoute, private http: HttpClient) {
    effect(() => {
      const url = this.slug();
      if (url) {
        this.http.get<PostDto>(`/api/posts/${url}`).subscribe({
          next: (postDto) => {
            this.postContent.set(postDto.content);
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
      const slug = params.get('slug')!;
      this.slug.set(slug);
    });
  }
}

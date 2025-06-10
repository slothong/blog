import { HttpClient } from '@angular/common/http';
import { Component, effect, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PostDto } from '../../models/post-dto';
import { Post } from '../../models/post';
import { PostDetailComponent } from '../../components/post-detail/post-detail';

@Component({
  selector: 'app-post-detail-page',
  styleUrl: './post-detail-page.scss',
  templateUrl: './post-detail-page.html',
  imports: [PostDetailComponent],
})
export class PostDetailPageComponent implements OnInit {
  readonly slug = signal<string | null>(null);
  readonly postSignal = signal<Post | null>(null);

  constructor(private route: ActivatedRoute, private http: HttpClient) {
    effect(() => {
      const url = this.slug();
      if (url) {
        this.http.get<PostDto>(`/api/posts/${url}`).subscribe({
          next: (postDto) => {
            this.postSignal.set(Post.fromDto(postDto));
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

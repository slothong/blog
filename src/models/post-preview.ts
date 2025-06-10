import { PostPreviewDto } from './post-preview-dto';

export class PostPreview {
  readonly title: string;
  readonly date: Date;
  readonly tags: string[];
  readonly preview: string;
  readonly slug: string;

  constructor({
    title,
    date,
    tags,
    preview,
    slug,
  }: {
    title: string;
    date: Date;
    tags: string[];
    preview: string;
    slug: string;
  }) {
    this.title = title;
    this.date = date;
    this.tags = tags;
    this.preview = preview;
    this.slug = slug;
  }

  static fromDto(dto: PostPreviewDto) {
    return new PostPreview({
      title: dto.title,
      date: new Date(dto.date),
      tags: dto.tags,
      preview: dto.preview,
      slug: dto.slug,
    });
  }
}

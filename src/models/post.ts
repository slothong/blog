import { PostDto } from './post-dto';

export class Post {
  constructor(
    readonly content: string,
    readonly title: string,
    readonly createdAt: Date,
    readonly tags: string[]
  ) {}

  static fromDto(dto: PostDto) {
    return new Post(
      dto.content,
      dto.data.title,
      new Date(dto.data.date),
      dto.data.tags
    );
  }
}

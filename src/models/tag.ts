import { TagDto } from './tag-dto';

export class Tag {
  constructor(readonly name: string, readonly count: number) {}

  static fromDto(dto: TagDto) {
    return new Tag(dto.name, dto.count);
  }
}

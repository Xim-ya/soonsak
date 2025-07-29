import { ContentDto } from '@/features/content/types';
import { ContentType } from './contentType.enum';

export interface BaseContentModel {
  readonly id: number;
  readonly title: string;
  readonly type: ContentType;
  readonly posterPath: string;
}

export namespace BaseContentModel {
  export function fromContentDto(dto: ContentDto): BaseContentModel {
    return {
      id: dto.id,
      title: dto.title ?? '제목 없음',
      type: dto.contentType ?? 'unknown',
      posterPath: dto.posterPath ?? '없데',
    };
  }
}

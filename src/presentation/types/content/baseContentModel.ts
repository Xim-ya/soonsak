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
    // contentType 유효성 검사
    const validTypes: ContentType[] = ['movie', 'tv', 'unknown'];
    const contentType = validTypes.includes(dto.contentType as ContentType)
      ? dto.contentType
      : 'unknown';

    return {
      id: dto.id,
      title: dto.title ?? '제목 없음',
      type: contentType as ContentType,
      posterPath: dto.posterPath ?? '없데',
    };
  }
}

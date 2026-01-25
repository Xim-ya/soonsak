/* eslint-disable @typescript-eslint/no-namespace */
import { ContentDto } from '@/features/content/types';
import { ContentType } from '@/presentation/types/content/contentType.enum';

/**
 * RelatedContentModel - 관련 콘텐츠 모델
 *
 * TMDB 추천 콘텐츠 중 Supabase에 등록된 콘텐츠를 표시하기 위한 모델
 */
export interface RelatedContentModel {
  readonly id: number;
  readonly title: string;
  readonly posterPath: string;
  readonly contentType: ContentType;
}

export namespace RelatedContentModel {
  /**
   * ContentDto를 RelatedContentModel로 변환
   */
  export function fromDto(dto: ContentDto): RelatedContentModel {
    return {
      id: dto.id,
      title: dto.title,
      posterPath: dto.posterPath,
      contentType: dto.contentType,
    };
  }

  /**
   * ContentDto 배열을 RelatedContentModel 배열로 변환
   */
  export function fromDtoList(dtoList: ContentDto[]): RelatedContentModel[] {
    return dtoList.map(fromDto);
  }
}

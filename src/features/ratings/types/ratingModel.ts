import type { ContentType } from '@/presentation/types/content/contentType.enum';
import type { RatingStatusResponse, RatingWithContentDto } from './index';

/**
 * RatingStatusModel - 평점 상태 UI 모델
 * RatingStatusResponse에서 UI에 필요한 필드만 선택
 */
export interface RatingStatusModel {
  readonly hasRating: boolean;
  readonly rating: number | null;
  readonly ratingId: string | null;
}

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace RatingStatusModel {
  export function fromDto(dto: RatingStatusResponse): RatingStatusModel {
    return {
      hasRating: dto.hasRating,
      rating: dto.rating,
      ratingId: dto.ratingId,
    };
  }
}

/**
 * RatingModel - 평점 UI 모델
 * RatingWithContentDto에서 UI에 필요한 필드만 선택
 */
export interface RatingModel {
  readonly id: string;
  readonly contentId: number;
  readonly contentType: ContentType;
  readonly contentTitle: string;
  readonly contentPosterPath: string;
  readonly rating: number;
}

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace RatingModel {
  export function fromDto(dto: RatingWithContentDto): RatingModel {
    return {
      id: dto.id,
      contentId: dto.contentId,
      contentType: dto.contentType,
      contentTitle: dto.contentTitle,
      contentPosterPath: dto.contentPosterPath,
      rating: dto.rating,
    };
  }

  export function fromDtoList(dtoList: RatingWithContentDto[]): RatingModel[] {
    return dtoList.map(fromDto);
  }
}

import type { RatingStatusResponse } from './index';

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

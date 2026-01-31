/**
 * RatingFilterTab - 평점 필터 탭 콘텐츠
 *
 * 별 아이콘을 탭하여 최소 평점을 선택합니다.
 * TMDB 10점 만점을 5점 별점 스케일로 변환합니다.
 */

import React from 'react';
import { StarRatingSelector } from '../StarRatingSelector';
import { FilterSectionHeader } from '../FilterSectionHeader';

interface RatingFilterTabProps {
  /** 현재 선택된 최소 별점 (1~5, null = 미선택) */
  readonly selectedRating: number | null;
  /** 별점 변경 콜백 */
  readonly onRatingChange: (rating: number | null) => void;
}

function RatingFilterTab({
  selectedRating,
  onRatingChange,
}: RatingFilterTabProps): React.ReactElement {
  return (
    <>
      <FilterSectionHeader title="평점" subtitle="(TMDB 평점)" />
      <StarRatingSelector selectedRating={selectedRating} onSelect={onRatingChange} />
    </>
  );
}

/* Styled Components */

export { RatingFilterTab };
export type { RatingFilterTabProps };

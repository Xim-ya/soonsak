/**
 * StarRatingSelector - 별점 선택 필터 컴포넌트
 *
 * 별 아이콘을 탭하여 최소 평점을 선택합니다.
 * 선택한 별 이하는 filled, 이상은 blank로 표시됩니다.
 * TMDB 10점 만점을 5점 스케일로 변환하여 사용합니다.
 *
 * @example
 * <StarRatingSelector
 *   selectedRating={3}
 *   onSelect={(rating) => updateFilter({ minStarRating: rating })}
 * />
 */

import React, { useCallback } from 'react';
import styled from '@emotion/native';
import StarBlankSvg from '@assets/icons/star_blank.svg';
import StarFilledSvg from '@assets/icons/star_filled.svg';

const TOTAL_STARS = 5;
const STAR_SIZE = 32;

interface StarRatingSelectorProps {
  /** 현재 선택된 최소 별점 (1~5, null = 미선택) */
  readonly selectedRating: number | null;
  /** 별점 선택 콜백 */
  readonly onSelect: (rating: number | null) => void;
}

function StarRatingSelector({
  selectedRating,
  onSelect,
}: StarRatingSelectorProps): React.ReactElement {
  const handleStarPress = useCallback(
    (star: number) => {
      // 같은 별 다시 누르면 해제
      if (selectedRating === star) {
        onSelect(null);
      } else {
        onSelect(star);
      }
    },
    [selectedRating, onSelect],
  );

  return (
    <Container>
      <StarRow>
        {Array.from({ length: TOTAL_STARS }, (_, index) => {
          const starValue = index + 1;
          const isFilled = selectedRating !== null && starValue <= selectedRating;

          return (
            <StarButton
              key={starValue}
              onPress={() => handleStarPress(starValue)}
              activeOpacity={0.7}
            >
              {isFilled ? (
                <StarFilledSvg width={STAR_SIZE} height={STAR_SIZE} />
              ) : (
                <StarBlankSvg width={STAR_SIZE} height={STAR_SIZE} />
              )}
            </StarButton>
          );
        })}
      </StarRow>
    </Container>
  );
}

/* Styled Components */

const Container = styled.View({
  paddingHorizontal: 20,
});

const StarRow = styled.View({
  flexDirection: 'row',
  justifyContent: 'flex-start',
  alignItems: 'center',
  gap: 8,
});

const StarButton = styled.TouchableOpacity({
  padding: 4,
});

export { StarRatingSelector };
export type { StarRatingSelectorProps };

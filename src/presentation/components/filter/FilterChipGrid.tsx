/**
 * FilterChipGrid - 필터 칩 그리드 레이아웃 컴포넌트
 *
 * 장르, 국가, 연도 등 필터 칩을 수평 wrap 그리드로 배치합니다.
 * 모든 필터 탭에서 공통으로 사용됩니다.
 *
 * @example
 * <FilterChipGrid>
 *   {genres.map((g) => <FilterChip key={g.id} ... />)}
 * </FilterChipGrid>
 */

import styled from '@emotion/native';

const FilterChipGrid = styled.View({
  flexDirection: 'row',
  flexWrap: 'wrap',
  paddingHorizontal: 20,
  gap: 8,
});

export { FilterChipGrid };

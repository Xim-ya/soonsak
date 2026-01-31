/**
 * FilterChip - 선택 가능한 필터 칩 컴포넌트
 *
 * 장르, 국가, 연도 등 필터 항목을 칩 형태로 표시합니다.
 * 선택/미선택 상태에 따라 스타일이 변경됩니다.
 *
 * @example
 * <FilterChip
 *   label="액션"
 *   selected={selectedGenres.includes(28)}
 *   onPress={() => toggleGenre(28)}
 * />
 */

import React from 'react';
import styled from '@emotion/native';
import textStyles from '@/shared/styles/textStyles';
import colors from '@/shared/styles/colors';

interface FilterChipProps {
  /** 칩에 표시할 텍스트 */
  readonly label: string;
  /** 선택 여부 */
  readonly selected: boolean;
  /** 칩 터치 콜백 */
  readonly onPress: () => void;
}

const FilterChip = React.memo(function FilterChip({
  label,
  selected,
  onPress,
}: FilterChipProps): React.ReactElement {
  return (
    <ChipContainer selected={selected} onPress={onPress} activeOpacity={0.7}>
      <ChipText selected={selected}>{label}</ChipText>
    </ChipContainer>
  );
});

/* Styled Components */

const ChipContainer = styled.TouchableOpacity<{ selected: boolean }>(({ selected }) => ({
  backgroundColor: selected ? colors.white : colors.gray05,
  paddingHorizontal: 16,
  paddingVertical: 8,
  borderRadius: 20,
  borderWidth: selected ? 0 : 1,
  borderColor: colors.gray04,
}));

const ChipText = styled.Text<{ selected: boolean }>(({ selected }) => ({
  ...textStyles.alert1,
  color: selected ? colors.black : colors.gray01,
}));

export { FilterChip };
export type { FilterChipProps };

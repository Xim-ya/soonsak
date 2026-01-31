/**
 * YearQuickSelect - 공개연도 퀵 선택 칩 그룹
 *
 * "올해", "2020년대" 등 자주 사용하는 연도 범위를 칩으로 제공합니다.
 * 선택 시 해당 연도 범위로 필터가 설정됩니다.
 *
 * @example
 * <YearQuickSelect
 *   selectedRange={filter.releaseYearRange}
 *   onSelect={(range) => updateFilter({ releaseYearRange: range })}
 * />
 */

import React, { useCallback } from 'react';
import { FilterChip } from './FilterChip';
import { FilterChipGrid } from './FilterChipGrid';
import type { YearRange } from '@/shared/types/filter/contentFilter';

interface YearPreset {
  readonly label: string;
  readonly range: YearRange;
}

const CURRENT_YEAR = new Date().getFullYear();

const YEAR_PRESETS: readonly YearPreset[] = [
  { label: '올해', range: { min: CURRENT_YEAR, max: CURRENT_YEAR } },
  { label: '2020년대', range: { min: 2020, max: 2029 } },
  { label: '2010년대', range: { min: 2010, max: 2019 } },
  { label: '2000년대', range: { min: 2000, max: 2009 } },
  { label: '1990년대', range: { min: 1990, max: 1999 } },
  { label: '그 이전', range: { min: 1900, max: 1989 } },
] as const;

interface YearQuickSelectProps {
  /** 현재 선택된 연도 범위 */
  readonly selectedRange: YearRange | null;
  /** 연도 범위 선택 콜백 */
  readonly onSelect: (range: YearRange | null) => void;
}

function YearQuickSelect({ selectedRange, onSelect }: YearQuickSelectProps): React.ReactElement {
  const isPresetSelected = useCallback(
    (preset: YearPreset): boolean => {
      if (!selectedRange) return false;
      return selectedRange.min === preset.range.min && selectedRange.max === preset.range.max;
    },
    [selectedRange],
  );

  const handlePresetPress = useCallback(
    (preset: YearPreset) => {
      if (isPresetSelected(preset)) {
        onSelect(null);
      } else {
        onSelect(preset.range);
      }
    },
    [isPresetSelected, onSelect],
  );

  return (
    <FilterChipGrid>
      {YEAR_PRESETS.map((preset) => (
        <FilterChip
          key={preset.label}
          label={preset.label}
          selected={isPresetSelected(preset)}
          onPress={() => handlePresetPress(preset)}
        />
      ))}
    </FilterChipGrid>
  );
}

export { YearQuickSelect, YEAR_PRESETS };
export type { YearQuickSelectProps };

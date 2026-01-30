/**
 * SoonsakHeader - 순삭 페이지 상단 헤더
 *
 * 글래스모피즘 스타일의 알림/검색 버튼이 포함된 헤더입니다.
 * 콘텐츠 그리드 위에 오버레이로 표시됩니다.
 *
 * @example
 * <SoonsakHeader onSearchPress={handleSearch} />
 */

import styled from '@emotion/native';
import colors from '@/shared/styles/colors';
import { AppSize } from '@/shared/utils/appSize';
import { GlassIconButton } from '@/presentation/components/button/GlassIconButton';
import SearchIcon from '@assets/icons/search_tab.svg';
import EyeIcon from '@assets/icons/eye.svg';

interface SoonsakHeaderProps {
  onNotificationPress?: () => void;
  onSearchPress?: () => void;
}

const HEADER_PADDING = 20;
const ICON_SIZE = 24;
const BUTTON_SIZE = 56;

function SoonsakHeader({ onNotificationPress, onSearchPress }: SoonsakHeaderProps) {
  return (
    <Container>
      <GlassIconButton size={BUTTON_SIZE} onPress={onNotificationPress}>
        <EyeIcon width={ICON_SIZE} height={ICON_SIZE} fill={colors.white} />
      </GlassIconButton>

      <GlassIconButton size={BUTTON_SIZE} onPress={onSearchPress}>
        <SearchIcon width={ICON_SIZE} height={ICON_SIZE} fill={colors.white} />
      </GlassIconButton>
    </Container>
  );
}

/* Styled Components */
const Container = styled.View({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingHorizontal: AppSize.ratioWidth(HEADER_PADDING),
  paddingTop: AppSize.statusBarHeight + AppSize.ratioHeight(HEADER_PADDING),
  zIndex: 10,
});

export { SoonsakHeader };
export type { SoonsakHeaderProps };

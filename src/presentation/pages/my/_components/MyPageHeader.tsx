/**
 * MyPageHeader - MY 페이지 상단 앱바
 *
 * MY 탭 상단에 표시되는 헤더입니다.
 * - 좌측: "MY" 타이틀
 * - 우측: 설정 아이콘
 */

import { TouchableOpacity } from 'react-native';
import styled from '@emotion/native';
import colors from '@/shared/styles/colors';
import textStyles from '@/shared/styles/textStyles';
import { AppSize } from '@/shared/utils/appSize';
import GearIcon from '@assets/icons/gear.svg';

interface MyPageHeaderProps {
  /** 설정 버튼 클릭 시 콜백 */
  readonly onSettingsPress?: () => void;
}

const ICON_SIZE = 20;

function MyPageHeader({ onSettingsPress }: MyPageHeaderProps) {
  return (
    <Container>
      <TitleText>MY</TitleText>
      <TouchableOpacity onPress={onSettingsPress} activeOpacity={0.7}>
        <GearIcon width={ICON_SIZE} height={ICON_SIZE} color={colors.white} />
      </TouchableOpacity>
    </Container>
  );
}

/* Styled Components */

const Container = styled.View({
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingHorizontal: AppSize.ratioWidth(16),
  paddingTop: AppSize.statusBarHeight + AppSize.ratioHeight(8),
  paddingBottom: AppSize.ratioHeight(4),
});

const TitleText = styled.Text({
  ...textStyles.title1,
  color: colors.white,
});

export { MyPageHeader };

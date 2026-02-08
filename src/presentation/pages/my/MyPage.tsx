/**
 * MyPage - MY 탭 화면
 *
 * 사용자 프로필 및 설정을 관리하는 화면입니다.
 */

import styled from '@emotion/native';
import { BasePage } from '@/presentation/components/page/BasePage';
import colors from '@/shared/styles/colors';
import textStyles from '@/shared/styles/textStyles';

export default function MyPage() {
  return (
    <BasePage>
      <Container>
        <Title>MY</Title>
      </Container>
    </BasePage>
  );
}

const Container = styled.View({
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
});

const Title = styled.Text({
  ...textStyles.headline1,
  color: colors.white,
});

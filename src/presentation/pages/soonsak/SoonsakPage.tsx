import styled from '@emotion/native';
import colors from '@/shared/styles/colors';
import textStyles from '@/shared/styles/textStyles';
import { BasePage } from '@/presentation/components/page/BasePage';

/**
 * SoonsakPage - 순삭하기 탭 화면
 *
 * 콘텐츠를 빠르게 찾을 수 있는 기능을 제공합니다.
 */
export default function SoonsakPage() {
  return (
    <BasePage>
      <Container>
        <Title>순삭하기</Title>
      </Container>
    </BasePage>
  );
}

/* Styled Components */
const Container = styled.View({
  flex: 1,
  paddingHorizontal: 16,
});

const Title = styled.Text({
  ...textStyles.headline1,
  color: colors.white,
});

/**
 * CurationPromptCard - 로그인 유도 텍스트 섹션
 *
 * 비로그인 사용자에게 맞춤 큐레이션 안내 텍스트를 표시합니다.
 * 하단 그라데이션 위에 텍스트를 직접 표시합니다.
 *
 * @example
 * <CurationPromptCard />
 */

import React from 'react';
import styled from '@emotion/native';
import colors from '@/shared/styles/colors';
import textStyles from '@/shared/styles/textStyles';

function CurationPromptCard(): React.ReactElement {
  return (
    <Container>
      <TitleText>나만의 큐레이션</TitleText>
      <DescriptionText>로그인하면 취향에 맞는 콘텐츠를 추천받을 수 있어요</DescriptionText>
    </Container>
  );
}

/* Styled Components */
const Container = styled.View({
  paddingHorizontal: 16,
});

const TitleText = styled.Text({
  ...textStyles.headline2,
  color: colors.white,
  marginBottom: 6,
});

const DescriptionText = styled.Text({
  ...textStyles.body2,
  color: colors.gray01,
});

export { CurationPromptCard };

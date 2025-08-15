import React from 'react';
import styled from '@emotion/native';
import { ExpandableTextView } from '@/presentation/components/text/ExpandableTextView';
import textStyle from '@/shared/styles/textStyles';
import colors from '@/shared/styles/colors';

export const SummaryView = () => {
  const overview =
    '선천성 청각 장애인 류에게 누나는 유일한 가족이다. 신부전증을 앓고 있는 누나는 병이 악화되어 신장을 이식하지 않으면 얼마 살 수 없다는 진단을 받는다. 누나와 혈액형이 달라 이식 수술이 좌절된 류는 장기밀매단과 접촉해 자신의 신장과 전재산 천 만원을 넘겨주고 누나를 위한 신장을 받기로 하지만 모든 것이 사기로 드러난다. 누나에게 맞는 신장을 찾기 위해 돈이 필요한 류는 애인이자 운동권 학생인 영미의 말에 아이를 유괴한다. 착한 유괴라고 류를 설득해 동진의 딸을 유괴하지만 이 사실을 알게 된 류의 누이는 스스로 목숨을 끊고 우연한 사건으로 아이마저 죽게 되는데';

  const isLoading = false;

  return (
    <Container>
      <Title>줄거리</Title>
      <ContentWrapper>
        <ExpandableTextView text={overview || ''} maxLines={3} isLoading={isLoading} />
      </ContentWrapper>
    </Container>
  );
};

/* Styled Components */
const Container = styled.View({
  width: '100%',
  paddingHorizontal: 16,
});

const Title = styled.Text({
  ...textStyle.title2,
  marginBottom: 8,
});

const ContentWrapper = styled.View({});

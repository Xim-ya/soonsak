import React from 'react';
import styled from '@emotion/native';
import { ExpandableTextView } from '@/presentation/components/text/ExpandableTextView';
import textStyle from '@/shared/styles/textStyles';
import colors from '@/shared/styles/colors';
import { useContentDetailRoute } from '../_hooks/useContentDetailRoute';
import { useContentDetail } from '@/features/tmdb/hooks/useContentDetail';

export const SummaryView = () => {
  const { id, type } = useContentDetailRoute();
  const { data: contentDetail, isLoading } = useContentDetail(id, type);

  return (
    <Container>
      <Title>줄거리</Title>
      <ContentWrapper>
        <ExpandableTextView
          text={contentDetail?.overview || ''}
          maxLines={3}
          isLoading={isLoading}
        />
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

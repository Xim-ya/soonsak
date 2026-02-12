/**
 * UserStatsSection - 사용자 활동 통계 섹션
 *
 * 찜한 콘텐츠, 평가한 콘텐츠, 시청 완료한 콘텐츠 개수를 표시합니다.
 */

import React, { memo } from 'react';
import styled from '@emotion/native';
import colors from '@/shared/styles/colors';
import textStyles from '@/shared/styles/textStyles';
import { AppSize } from '@/shared/utils/appSize';

interface UserStatsSectionProps {
  /** 찜한 콘텐츠 개수 */
  readonly favoritesCount: number;
  /** 평가한 콘텐츠 개수 (추후 구현) */
  readonly ratingsCount: number;
  /** 시청 완료한 콘텐츠 개수 */
  readonly watchedCount: number;
}

interface StatItemProps {
  readonly count: number;
  readonly label: string;
}

const StatItem = memo(function StatItem({ count, label }: StatItemProps) {
  return (
    <StatItemContainer>
      <StatCount>{count}</StatCount>
      <StatLabel>{label}</StatLabel>
    </StatItemContainer>
  );
});

function UserStatsSectionComponent({
  favoritesCount,
  ratingsCount,
  watchedCount,
}: UserStatsSectionProps) {
  return (
    <Container>
      <StatItem count={favoritesCount} label="찜했어요" />
      <Divider />
      <StatItem count={ratingsCount} label="평가했어요" />
      <Divider />
      <StatItem count={watchedCount} label="봤어요" />
    </Container>
  );
}

/* Styled Components */

const Container = styled.View({
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-around',
  backgroundColor: colors.gray06,
  marginHorizontal: AppSize.ratioWidth(16),
  paddingVertical: AppSize.ratioHeight(16),
  borderRadius: 12,
});

const StatItemContainer = styled.View({
  flex: 1,
  alignItems: 'center',
});

const StatCount = styled.Text({
  ...textStyles.headline2,
  color: colors.white,
});

const StatLabel = styled.Text({
  ...textStyles.alert2,
  color: colors.gray02,
  marginTop: 4,
});

const Divider = styled.View({
  width: 1,
  height: 32,
  backgroundColor: colors.gray05,
});

export const UserStatsSection = memo(UserStatsSectionComponent);

import { Tabs } from 'react-native-collapsible-tab-view';
import React from 'react';
import styled from '@emotion/native';

import { useTabScrollListener } from '../_hooks/useTabScrollListener';
import colors from '@/shared/styles/colors';
import textStyles from '@/shared/styles/textStyles';

/**
 * OriginContentTabView - 댓글 탭 뷰
 *
 * 현재 빈 상태로 유지됩니다.
 * 추후 다른 기능이 추가될 예정입니다.
 */
function OriginContentTabView({ onScrollChange }: { onScrollChange: (offset: number) => void }) {
  useTabScrollListener(onScrollChange);

  return (
    <Tabs.ScrollView style={{ flex: 1 }}>
      <EmptyContainer>
        <EmptyText>준비 중입니다.</EmptyText>
        <EmptySubText>곧 새로운 기능이 추가될 예정이에요.</EmptySubText>
      </EmptyContainer>
    </Tabs.ScrollView>
  );
}

/* Styled Components */
const EmptyContainer = styled.View({
  flex: 1,
  alignItems: 'center',
  justifyContent: 'center',
  paddingVertical: 100,
  paddingHorizontal: 24,
});

const EmptyText = styled.Text({
  ...textStyles.title2,
  color: colors.white,
  marginBottom: 8,
});

const EmptySubText = styled.Text({
  ...textStyles.body2,
  color: colors.gray02,
  textAlign: 'center',
});

const MemoizedOriginContentTabView = React.memo(OriginContentTabView);
MemoizedOriginContentTabView.displayName = 'OriginalTabView';

export { MemoizedOriginContentTabView as OriginalTabView };

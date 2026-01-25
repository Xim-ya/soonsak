import { Tabs } from 'react-native-collapsible-tab-view';
import React from 'react';

import { useTabScrollListener } from '../_hooks/useTabScrollListener';

function OriginContentTabView({ onScrollChange }: { onScrollChange: (offset: number) => void }) {
  useTabScrollListener(onScrollChange);

  return (
    <Tabs.ScrollView style={{ flex: 1 }}>{/* TODO: 원작 콘텐츠 정보 추가 예정 */}</Tabs.ScrollView>
  );
}

const MemoizedOriginContentTabView = React.memo(OriginContentTabView);
MemoizedOriginContentTabView.displayName = 'OriginalTabView';

export { MemoizedOriginContentTabView as OriginalTabView };

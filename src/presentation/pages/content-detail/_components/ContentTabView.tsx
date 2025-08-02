import { Tabs } from 'react-native-collapsible-tab-view';
import { ContentTab } from './ContentTab';
import React from 'react';
import { useTabScrollListener } from '../_hooks/useTabScrollListener';

// 메모이제이션된 탭 컴포넌트들
const ContentTabView = React.memo(
  ({ onScrollChange }: { onScrollChange: (offset: number) => void }) => {
    useTabScrollListener(onScrollChange);

    return (
      <Tabs.ScrollView style={{ flex: 1 }}>
        <ContentTab />
      </Tabs.ScrollView>
    );
  },
);

ContentTabView.displayName = 'ContentTabWithLogging';

export { ContentTabView };

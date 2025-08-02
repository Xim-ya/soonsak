import { Tabs } from 'react-native-collapsible-tab-view';
import React from 'react';
import { OriginalInfoTab } from './OriginalInfoTab';
import { useTabScrollListener } from '../_hooks/useTabScrollListener';

const OriginalTabView = React.memo(
  ({ onScrollChange }: { onScrollChange: (offset: number) => void }) => {
    useTabScrollListener(onScrollChange);

    return (
      <Tabs.ScrollView style={{ flex: 1 }}>
        <OriginalInfoTab />
      </Tabs.ScrollView>
    );
  },
);

OriginalTabView.displayName = 'OriginalTabView';

export { OriginalTabView };

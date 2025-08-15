import { Tabs } from 'react-native-collapsible-tab-view';
import React from 'react';

import { useTabScrollListener } from '../_hooks/useTabScrollListener';
import { SummaryView } from './SummaryView';
import Gap from '@/presentation/components/view/Gap';
import CaseView from './CaseView';

const OriginContentTabView = React.memo(
  ({ onScrollChange }: { onScrollChange: (offset: number) => void }) => {
    useTabScrollListener(onScrollChange);

    return (
      <Tabs.ScrollView style={{ flex: 1 }}>
        <Gap size={40} />
        <SummaryView />
        <CaseView />
      </Tabs.ScrollView>
    );
  },
);

OriginContentTabView.displayName = 'OriginalTabView';

export { OriginContentTabView as OriginalTabView };

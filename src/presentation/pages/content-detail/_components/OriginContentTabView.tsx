import { Tabs } from 'react-native-collapsible-tab-view';
import React from 'react';

import { useTabScrollListener } from '../_hooks/useTabScrollListener';
import { SummaryView } from './SummaryView';
import Gap from '@/presentation/components/view/Gap';
import CaseView from './CaseView';

function OriginContentTabView({ onScrollChange }: { onScrollChange: (offset: number) => void }) {
  useTabScrollListener(onScrollChange);

  return (
    <Tabs.ScrollView style={{ flex: 1 }}>
      <Gap size={40} />
      <SummaryView />
      <CaseView />
    </Tabs.ScrollView>
  );
}

const MemoizedOriginContentTabView = React.memo(OriginContentTabView);
MemoizedOriginContentTabView.displayName = 'OriginalTabView';

export { MemoizedOriginContentTabView as OriginalTabView };

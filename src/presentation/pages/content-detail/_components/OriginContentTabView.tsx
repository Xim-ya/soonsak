import { Tabs } from 'react-native-collapsible-tab-view';
import React from 'react';

import { useTabScrollListener } from '../_hooks/useTabScrollListener';
import { CommentsView } from './CommentsView';
import Gap from '@/presentation/components/view/Gap';

function OriginContentTabView({ onScrollChange }: { onScrollChange: (offset: number) => void }) {
  useTabScrollListener(onScrollChange);

  return (
    <Tabs.ScrollView style={{ flex: 1 }}>
      <Gap size={24} />
      {/* YouTube 댓글 섹션 */}
      <CommentsView />
    </Tabs.ScrollView>
  );
}

const MemoizedOriginContentTabView = React.memo(OriginContentTabView);
MemoizedOriginContentTabView.displayName = 'OriginalTabView';

export { MemoizedOriginContentTabView as OriginalTabView };

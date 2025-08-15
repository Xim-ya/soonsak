import { Tabs } from 'react-native-collapsible-tab-view';
import React from 'react';
import { useTabScrollListener } from '../_hooks/useTabScrollListener';
import { VideoMetricsView } from './VideoMetricsView';

import { OtherChannelVideoListView } from './OtherChannelVideoListView';
import { ChannelInfoView } from './ChannelInfoView';

// 메모이제이션된 탭 컴포넌트
function VideoTabView({ onScrollChange }: { onScrollChange: (offset: number) => void }) {
  useTabScrollListener(onScrollChange);

  return (
    <Tabs.ScrollView style={{ flex: 1 }}>
      {/* 조회수 , 좋아요, 업로드일 */}
      <VideoMetricsView />
      {/* 채널 정보 */}
      <ChannelInfoView />

      {/* 다른 채널 영상 리스트 */}
      <OtherChannelVideoListView />
    </Tabs.ScrollView>
  );
}

const MemoizedVideoTabView = React.memo(VideoTabView);
MemoizedVideoTabView.displayName = 'VideoTabView';

export { MemoizedVideoTabView as ContentTabView };

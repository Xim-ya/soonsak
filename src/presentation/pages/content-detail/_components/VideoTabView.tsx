import { Tabs } from 'react-native-collapsible-tab-view';
import { ContentTab } from './OriginContentTabView';
import React from 'react';
import { useTabScrollListener } from '../_hooks/useTabScrollListener';
import { VideoMetricsView } from './VideoMetricsView';
import Gap from '@/presentation/components/view/Gap';
import { OtherChannelVideoListView } from './OtherChannelVideoListView';

// 메모이제이션된 탭 컴포넌트들
const VideoTabView = React.memo(
  ({ onScrollChange }: { onScrollChange: (offset: number) => void }) => {
    useTabScrollListener(onScrollChange);

    return (
      <Tabs.ScrollView style={{ flex: 1 }}>
        {/* 조회수 , 좋아요, 업로드일 */}
        <VideoMetricsView />
        {/* 다른 채널 영상 리스트 */}
        <OtherChannelVideoListView />
      </Tabs.ScrollView>
    );
  },
);

VideoTabView.displayName = 'VideoTabView';

export { VideoTabView as ContentTabView };

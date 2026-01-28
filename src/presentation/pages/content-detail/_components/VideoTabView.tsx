import { Tabs } from 'react-native-collapsible-tab-view';
import React, { useState, useCallback } from 'react';
import { useTabScrollListener } from '../_hooks/useTabScrollListener';
import { VideoMetricsView } from './VideoMetricsView';
import { SummaryView } from './SummaryView';
import CaseView from './CaseView';
import { OtherChannelVideoListView } from './OtherChannelVideoListView';
import { ChannelInfoView } from './ChannelInfoView';
import { RelatedContentsView } from './RelatedContentsView';
import { FeaturedCommentView } from './FeaturedCommentView';
import { CommentsBottomSheet } from './CommentsBottomSheet';

// 메모이제이션된 탭 컴포넌트
function VideoTabView({ onScrollChange }: { onScrollChange: (offset: number) => void }) {
  useTabScrollListener(onScrollChange);

  // 댓글 바텀시트 상태
  const [isCommentsVisible, setIsCommentsVisible] = useState(false);

  // 바텀시트 열기/닫기 핸들러
  const handleShowComments = useCallback(() => {
    setIsCommentsVisible(true);
  }, []);

  const handleCloseComments = useCallback(() => {
    setIsCommentsVisible(false);
  }, []);

  return (
    <>
      <Tabs.ScrollView style={{ flex: 1 }}>
        {/* YouTube 메트릭 정보 */}
        <VideoMetricsView />

        {/* 채널 정보 */}
        <ChannelInfoView />

        {/* 다른 채널 영상 리스트 */}
        <OtherChannelVideoListView />

        {/* 관련 콘텐츠 섹션 */}
        <RelatedContentsView />

        {/* 대표 감상평 섹션 */}
        <FeaturedCommentView onPressShowAll={handleShowComments} />

        {/* 줄거리 */}
        <SummaryView />

        {/* 출연진 */}
        <CaseView />
      </Tabs.ScrollView>

      {/* 전체 댓글 바텀시트 */}
      <CommentsBottomSheet visible={isCommentsVisible} onClose={handleCloseComments} />
    </>
  );
}

const MemoizedVideoTabView = React.memo(VideoTabView);
MemoizedVideoTabView.displayName = 'VideoTabView';

export { MemoizedVideoTabView as ContentTabView };

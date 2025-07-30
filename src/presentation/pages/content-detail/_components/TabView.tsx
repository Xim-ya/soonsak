import React, { useState } from 'react';
import styled from '@emotion/native';
import { StickyTabBar, TabType } from './StickyTabBar';
import { ContentTab } from './ContentTab';
import { OriginalInfoTab } from './OriginalInfoTab';
import colors from '@/shared/styles/colors';

/**
 * 탭뷰 컨테이너 컴포넌트
 * 스티키 탭바와 탭별 콘텐츠를 관리합니다.
 */
export const TabView = React.memo(() => {
  const [activeTab, setActiveTab] = useState<TabType>('content');

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'content':
        return <ContentTab />;
      case 'originalInfo':
        return <OriginalInfoTab />;
      default:
        return <ContentTab />;
    }
  };

  return (
    <Container>
      <StickyHeader>
        <StickyTabBar activeTab={activeTab} onTabChange={handleTabChange} />
      </StickyHeader>
      <TabContentContainer>
        {renderTabContent()}
      </TabContentContainer>
    </Container>
  );
});

/* Styled Components */
const Container = styled.View({
  flex: 1,
  backgroundColor: colors.black,
});

const StickyHeader = styled.View({
  backgroundColor: colors.black,
  elevation: 4, // Android shadow
  shadowColor: colors.black, // iOS shadow
  shadowOffset: {
    width: 0,
    height: 2,
  },
  shadowOpacity: 0.25,
  shadowRadius: 3.84,
  zIndex: 1000,
});

const TabContentContainer = styled.View({
  flex: 1,
  backgroundColor: colors.black,
});

TabView.displayName = 'TabView';
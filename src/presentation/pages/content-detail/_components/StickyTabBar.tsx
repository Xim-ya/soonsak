import React from 'react';
import { TouchableOpacity } from 'react-native';
import styled from '@emotion/native';
import colors from '@/shared/styles/colors';
import textStyles from '@/shared/styles/textStyles';

export type TabType = 'content' | 'originalInfo';

interface StickyTabBarProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

const TAB_ITEMS = [
  { key: 'content' as TabType, label: '콘텐츠' },
  { key: 'originalInfo' as TabType, label: '원작 정보' },
] as const;

/**
 * 스티키 탭바 컴포넌트
 * 스크롤 시 상단에 고정되는 탭바입니다.
 */
export const StickyTabBar = React.memo<StickyTabBarProps>(({ activeTab, onTabChange }) => {
  return (
    <Container>
      {TAB_ITEMS.map((item) => (
        <TabButton
          key={item.key}
          onPress={() => onTabChange(item.key)}
          activeOpacity={0.7}
        >
          <TabText isActive={activeTab === item.key}>{item.label}</TabText>
          {activeTab === item.key && <ActiveIndicator />}
        </TabButton>
      ))}
    </Container>
  );
});

/* Styled Components */
const Container = styled.View({
  flexDirection: 'row',
  backgroundColor: colors.black,
  borderBottomWidth: 1,
  borderBottomColor: colors.gray05,
  elevation: 4, // Android shadow
  shadowColor: colors.black, // iOS shadow
  shadowOffset: {
    width: 0,
    height: 2,
  },
  shadowOpacity: 0.1,
  shadowRadius: 3,
  zIndex: 10,
});

const TabButton = styled(TouchableOpacity)({
  flex: 1,
  paddingVertical: 16,
  paddingHorizontal: 20,
  alignItems: 'center',
  position: 'relative',
});

const TabText = styled.Text<{ isActive: boolean }>(({ isActive }) => ({
  ...textStyles.body1,
  color: isActive ? colors.white : colors.gray02,
  fontWeight: isActive ? '600' : '400',
}));

const ActiveIndicator = styled.View({
  position: 'absolute',
  bottom: 0,
  height: 2,
  width: '100%',
  backgroundColor: colors.main,
});

StickyTabBar.displayName = 'StickyTabBar';

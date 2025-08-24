import React from 'react';
import { Tabs, MaterialTabBar } from 'react-native-collapsible-tab-view';
import { useSafeAreaInsets, EdgeInsets } from 'react-native-safe-area-context';
import styled from '@emotion/native';
import { useRoute } from '@react-navigation/native';
import { BasePage } from '../../components/page';
import { BackButtonAppBar } from '../../components/app-bar';
import { Header } from './_components';
import colors from '@/shared/styles/colors';
import textStyles from '@/shared/styles/textStyles';
import { DarkedLinearShadow, LinearAlign } from '../../components/shadow/DarkedLinearShadow';
import { useSharedValue, withTiming, useAnimatedStyle } from 'react-native-reanimated';
import Animated from 'react-native-reanimated';
import { useCallback } from 'react';
import { TabBar } from './_components/TabBar';
import { ContentTabView } from './_components/VideoTabView';
import { OriginalTabView } from './_components/OriginContentTabView';
import { AnimatedAppBAr } from './_components/AnimatedAppBar';
import { ScreenRouteProp } from '@/shared/navigation/types';
import { routePages } from '@/shared/navigation/constant/routePages';

export default function ContentDetailPage() {
  const route = useRoute<ScreenRouteProp<typeof routePages.contentDetail>>();
  const { id, title, type } = route.params;
  const insets = useSafeAreaInsets();
  const appBarOpacity = useSharedValue(0);

  // 스크롤 오프셋 변화 처리 - 메모이제이션으로 리렌더링 최적화
  const handleScrollChange = useCallback(
    (offset: number) => {
      // y offset이 269 이상이면 opacity 1.0, 미만이면 0.0
      const targetOpacity = offset >= 269.0 ? 1.0 : 0.0;
      // 현재 opacity와 다를 때만 애니메이션 실행 (성능 최적화)
      if (Math.abs(appBarOpacity.value - targetOpacity) > 0.01) {
        appBarOpacity.value = withTiming(targetOpacity, {
          duration: 400,
        });
      }
    },
    [appBarOpacity],
  );

  return (
    <BasePage
      useSafeArea={false}
      touchableWithoutFeedback={false}
      automaticallyAdjustKeyboardInsets={false}
      dismissKeyboardOnTap={false}
    >
      <GradientContainer safeAreaHeight={insets.top}>
        <DarkedLinearShadow height={insets.top + 140} align={LinearAlign.topBottom} />
      </GradientContainer>
      <BackgroundContainer
        style={useAnimatedStyle(() => {
          'worklet';
          return {
            backgroundColor: `rgba(0,0,0,${appBarOpacity.value})`,
          };
        }, [appBarOpacity])}
        safeAreaHeight={insets.top}
      />
      <AnimatedAppBAr insets={insets} opacity={appBarOpacity} />
      <TabsContainer paddingTop={insets.top}>
        <Tabs.Container
          renderHeader={() => <Header />}
          renderTabBar={(props) => <TabBar {...props} />}
          allowHeaderOverscroll={true}
          headerHeight={480} // Header aspectRatio 높이 + ContentInfoView 예상 높이
          tabBarHeight={48}
          minHeaderHeight={48} // 앱바 높이만큼 최소 헤더 높이 설정
        >
          <Tabs.Tab name="영상" label="videoInfo">
            <ContentTabView onScrollChange={handleScrollChange} />
          </Tabs.Tab>
          <Tabs.Tab name="원작" label="originalInfo ">
            <OriginalTabView onScrollChange={handleScrollChange} />
          </Tabs.Tab>
        </Tabs.Container>
      </TabsContainer>
    </BasePage>
  );
}

/* Styled Components */
const GradientContainer = styled(Animated.View)<{ safeAreaHeight: number }>(
  ({ safeAreaHeight }) => ({
    position: 'absolute',
    top: 0, // SafeArea 포함하여 최상단부터 시작
    left: 0,
    right: 0,
    height: safeAreaHeight + 140, // SafeArea 높이 + 그라데이션 높이
    zIndex: 997, // AppBar보다 낮은 z-index
    pointerEvents: 'none',
  }),
);

const BackgroundContainer = styled(Animated.View)<{ safeAreaHeight: number }>(
  ({ safeAreaHeight }) => ({
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: safeAreaHeight + 48, // SafeArea 높이 + AppBar 높이
    zIndex: 998, // 그라데이션보다 높고, BackButtonAppBar보다 낮음
  }),
);

const TabsContainer = styled.View<{ paddingTop: number }>(({ paddingTop }) => ({
  flex: 1,
  backgroundColor: colors.black,
  paddingTop,
}));

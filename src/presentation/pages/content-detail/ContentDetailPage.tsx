import React from 'react';
import { Tabs, MaterialTabBar, useCurrentTabScrollY } from 'react-native-collapsible-tab-view';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import styled from '@emotion/native';
import { BasePage } from '../../components/page';
import { BackButtonAppBar } from '../../components/app-bar';
import { Header, ContentTab, OriginalInfoTab } from './_components';
import ContentInfoView from './_components/ContentInfoView';
import colors from '@/shared/styles/colors';
import textStyles from '@/shared/styles/textStyles';
import { DarkedLinearShadow, LinearAlign } from '../../components/shadow/DarkedLinearShadow';
import {
  useAnimatedReaction,
  runOnJS,
  useSharedValue,
  withTiming,
  useAnimatedStyle,
} from 'react-native-reanimated';
import Animated from 'react-native-reanimated';
import { useRef, useCallback, useMemo } from 'react';

const HeaderComponent = React.memo(() => (
  <HeaderContainer pointerEvents="box-none">
    <Header />
    <ContentInfoView />
  </HeaderContainer>
));

const CustomTabBar = React.memo((props: any) => (
  <TabBarContainer>
    <MaterialTabBar
      {...props}
      activeColor={colors.white}
      inactiveColor={colors.gray02}
      indicatorStyle={{ backgroundColor: colors.main, height: 2 }}
      style={{ backgroundColor: colors.black }}
      labelStyle={{
        ...textStyles.body1,
        fontWeight: '600',
        fontSize: 16,
      }}
      tabStyle={{
        paddingVertical: 20,
        height: 68,
      }}
    />
  </TabBarContainer>
));

HeaderComponent.displayName = 'HeaderComponent';
CustomTabBar.displayName = 'CustomTabBar';

// 타입 호환성을 위한 래퍼 함수들
const renderHeader = () => <HeaderComponent />;
const renderTabBar = (props: any) => <CustomTabBar {...props} />;

// 성능 최적화를 위한 커스텀 훅
const useScrollLogging = (onScrollChange: (offset: number) => void) => {
  const scrollY = useCurrentTabScrollY();
  const lastLoggedOffset = useRef(0);
  const lastOpacityChange = useRef(0);

  // 메모이제이션된 로그 함수
  const logScrollOffset = useCallback(
    (offset: number) => {
      // 로그 출력 최적화 (10픽셀 이상 변경시만)
      if (Math.abs(offset - lastLoggedOffset.current) >= 10) {
        console.log(`[ContentDetailPage] 스크롤 오프셋: ${offset.toFixed(2)}`);
        lastLoggedOffset.current = offset;
      }

      // opacity 변경이 필요한 경우만 콜백 호출 (성능 최적화)
      const shouldShowAppBar = offset >= 269.0;
      const lastShouldShow = lastOpacityChange.current >= 269.0;
      if (shouldShowAppBar !== lastShouldShow) {
        lastOpacityChange.current = offset;
        onScrollChange(offset);
      }
    },
    [onScrollChange],
  );

  // 스크롤 변화 감지 - 쓰로틀링 적용
  useAnimatedReaction(
    () => scrollY.value,
    (currentValue) => {
      runOnJS(logScrollOffset)(currentValue);
    },
    [], // dependency 배열 최적화
  );
};

// 메모이제이션된 탭 컴포넌트들
const ContentTabWithLogging = React.memo(
  ({ onScrollChange }: { onScrollChange: (offset: number) => void }) => {
    useScrollLogging(onScrollChange);

    return (
      <Tabs.ScrollView style={{ flex: 1 }}>
        <ContentTab />
      </Tabs.ScrollView>
    );
  },
);

const OriginalInfoTabWithLogging = React.memo(
  ({ onScrollChange }: { onScrollChange: (offset: number) => void }) => {
    useScrollLogging(onScrollChange);

    return (
      <Tabs.ScrollView style={{ flex: 1 }}>
        <OriginalInfoTab />
      </Tabs.ScrollView>
    );
  },
);

ContentTabWithLogging.displayName = 'ContentTabWithLogging';
OriginalInfoTabWithLogging.displayName = 'OriginalInfoTabWithLogging';

// 최적화된 AnimatedBackButtonAppBar 컴포넌트
const AnimatedBackButtonAppBar = React.memo(
  ({ insets, opacity }: { insets: any; opacity: any }) => {
    // backgroundColor 문자열 생성 최적화
    const animatedStyle = useAnimatedStyle(() => {
      'worklet';
      const opacityValue = opacity.value;
      // 0일 때는 완전 투명, 1일 때는 완전 불투명
      return {
        backgroundColor: `rgba(0,0,0,${opacityValue})`,
      };
    }, []);

    // 스타일 객체 메모이제이션
    const containerStyle = useMemo(
      () => ({
        position: 'absolute' as const,
        top: insets.top,
        left: 0,
        right: 0,
        zIndex: 999,
      }),
      [insets.top],
    );

    return (
      <Animated.View style={[containerStyle, animatedStyle]}>
        <BackButtonAppBar position="relative" backgroundColor="transparent" />
      </Animated.View>
    );
  },
);

AnimatedBackButtonAppBar.displayName = 'AnimatedBackButtonAppBar';

// 고정된 상단 그라데이션 그림자 컴포넌트
const FixedTopGradient = React.memo(({ insets }: { insets: any }) => {
  const containerStyle = useMemo(
    () => ({
      position: 'absolute' as const,
      top: 0, // SafeArea 포함하여 최상단부터 시작
      left: 0,
      right: 0,
      height: insets.top + 140, // SafeArea 높이 + 그라데이션 높이
      zIndex: 997, // AppBar보다 낮은 z-index
      pointerEvents: 'none' as const,
    }),
    [insets.top],
  );

  return (
    <Animated.View style={containerStyle}>
      <DarkedLinearShadow height={insets.top + 140} align={LinearAlign.topBottom} />
    </Animated.View>
  );
});

// 상단 SafeArea + AppBar 통합 배경 컴포넌트
const AnimatedTopBackground = React.memo(({ insets, opacity }: { insets: any; opacity: any }) => {
  const animatedStyle = useAnimatedStyle(() => {
    'worklet';
    const opacityValue = opacity.value;
    return {
      backgroundColor: `rgba(0,0,0,${opacityValue})`,
    };
  }, []);

  const containerStyle = useMemo(
    () => ({
      position: 'absolute' as const,
      top: 0,
      left: 0,
      right: 0,
      height: insets.top + 48, // SafeArea 높이 + AppBar 높이
      zIndex: 998, // 그라데이션보다 높고, BackButtonAppBar보다 낮음
    }),
    [insets.top],
  );

  return <Animated.View style={[containerStyle, animatedStyle]} />;
});

FixedTopGradient.displayName = 'FixedTopGradient';
AnimatedTopBackground.displayName = 'AnimatedTopBackground';

export default function ContentDetailPage() {
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
      <FixedTopGradient insets={insets} />
      <AnimatedTopBackground insets={insets} opacity={appBarOpacity} />
      <AnimatedBackButtonAppBar insets={insets} opacity={appBarOpacity} />
      <TabsContainer paddingTop={insets.top}>
        <Tabs.Container
          renderHeader={renderHeader}
          renderTabBar={renderTabBar}
          allowHeaderOverscroll={true}
          headerHeight={480} // Header aspectRatio 높이 + ContentInfoView 예상 높이
          tabBarHeight={68}
          minHeaderHeight={48} // 앱바 높이만큼 최소 헤더 높이 설정
        >
          <Tabs.Tab name="content" label="콘텐츠">
            <ContentTabWithLogging onScrollChange={handleScrollChange} />
          </Tabs.Tab>
          <Tabs.Tab name="originalInfo" label="원작 정보">
            <OriginalInfoTabWithLogging onScrollChange={handleScrollChange} />
          </Tabs.Tab>
        </Tabs.Container>
      </TabsContainer>
    </BasePage>
  );
}

/* Styled Components */
const TabsContainer = styled.View<{ paddingTop: number }>(({ paddingTop }) => ({
  flex: 1,
  backgroundColor: colors.black,
  paddingTop,
}));

const HeaderContainer = styled.View({
  backgroundColor: colors.black,
});

const TabBarContainer = styled.View({
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
});

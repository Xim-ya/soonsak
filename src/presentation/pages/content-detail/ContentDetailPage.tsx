import { Tabs, MaterialTabBar, useCurrentTabScrollY } from 'react-native-collapsible-tab-view';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import styled from '@emotion/native';
import { BasePage } from '../../components/page';
import { BackButtonAppBar } from '../../components/app-bar';
import { Header, ContentTab, OriginalInfoTab } from './_components';
import ContentInfoView from './_components/ContentInfoView';
import colors from '@/shared/styles/colors';
import textStyles from '@/shared/styles/textStyles';
import {
  useAnimatedReaction,
  runOnJS,
  useSharedValue,
  withTiming,
  useAnimatedStyle,
} from 'react-native-reanimated';
import Animated from 'react-native-reanimated';
import { useRef } from 'react';

const HeaderComponent = () => (
  <HeaderContainer pointerEvents="box-none">
    <Header />
    <ContentInfoView />
  </HeaderContainer>
);

const CustomTabBar = (props: any) => (
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
);

// 스크롤 로그를 출력하는 탭 컴포넌트
const ContentTabWithLogging = ({
  onScrollChange,
}: {
  onScrollChange: (offset: number) => void;
}) => {
  const scrollY = useCurrentTabScrollY();
  const lastLoggedOffset = useRef(0);

  // 로그를 출력하는 함수
  const logScrollOffset = (offset: number) => {
    // 오프셋이 10 이상 변경되었을 때만 로그 출력 (너무 많은 로그 방지)
    if (Math.abs(offset - lastLoggedOffset.current) >= 10) {
      console.log(`[ContentDetailPage] 스크롤 오프셋: ${offset.toFixed(2)}`);
      lastLoggedOffset.current = offset;
    }
    onScrollChange(offset);
  };

  // 스크롤 변화 감지
  useAnimatedReaction(
    () => scrollY.value,
    (currentValue) => {
      runOnJS(logScrollOffset)(currentValue);
    },
  );

  return (
    <Tabs.ScrollView style={{ flex: 1 }}>
      <ContentTab />
    </Tabs.ScrollView>
  );
};

const OriginalInfoTabWithLogging = ({
  onScrollChange,
}: {
  onScrollChange: (offset: number) => void;
}) => {
  const scrollY = useCurrentTabScrollY();
  const lastLoggedOffset = useRef(0);

  // 로그를 출력하는 함수
  const logScrollOffset = (offset: number) => {
    // 오프셋이 10 이상 변경되었을 때만 로그 출력 (너무 많은 로그 방지)
    if (Math.abs(offset - lastLoggedOffset.current) >= 10) {
      console.log(`[ContentDetailPage] 스크롤 오프셋: ${offset.toFixed(2)}`);
      lastLoggedOffset.current = offset;
    }
    onScrollChange(offset);
  };

  // 스크롤 변화 감지
  useAnimatedReaction(
    () => scrollY.value,
    (currentValue) => {
      runOnJS(logScrollOffset)(currentValue);
    },
  );

  return (
    <Tabs.ScrollView style={{ flex: 1 }}>
      <OriginalInfoTab />
    </Tabs.ScrollView>
  );
};

const AnimatedBackButtonAppBar = ({ insets, opacity }: { insets: any; opacity: any }) => {
  const animatedStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: `rgba(0, 0, 0, ${opacity.value})`,
    };
  });

  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          top: insets.top,
          left: 0,
          right: 0,
          zIndex: 999,
        },
        animatedStyle,
      ]}
    >
      <BackButtonAppBar position="relative" backgroundColor="transparent" />
    </Animated.View>
  );
};

export default function ContentDetailPage() {
  const insets = useSafeAreaInsets();
  const appBarOpacity = useSharedValue(0);

  // 스크롤 오프셋 변화 처리
  const handleScrollChange = (offset: number) => {
    // y offset이 80 이상이면 opacity 1.0, 미만이면 0.0
    const targetOpacity = offset >= 269.0 ? 1.0 : 0.0;
    appBarOpacity.value = withTiming(targetOpacity, { duration: 400 });
  };

  return (
    <BasePage
      useSafeArea={false}
      touchableWithoutFeedback={false}
      automaticallyAdjustKeyboardInsets={false}
      dismissKeyboardOnTap={false}
    >
      <AnimatedBackButtonAppBar insets={insets} opacity={appBarOpacity} />
      <TabsContainer paddingTop={insets.top}>
        <Tabs.Container
          renderHeader={HeaderComponent}
          renderTabBar={CustomTabBar}
          allowHeaderOverscroll={true}
          headerHeight={320 + 160} // Header aspectRatio 높이 + ContentInfoView 예상 높이
          tabBarHeight={68}
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

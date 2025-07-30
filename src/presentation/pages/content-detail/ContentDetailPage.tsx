import React from 'react';
import { Tabs, MaterialTabBar } from 'react-native-collapsible-tab-view';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import styled from '@emotion/native';
import { BasePage } from '../../components/page';
import { BackButtonAppBar } from '../../components/app-bar';
import { Header, ContentTab, OriginalInfoTab } from './_components';
import ContentInfoView from './_components/ContentInfoView';
import colors from '@/shared/styles/colors';
import textStyles from '@/shared/styles/textStyles';

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

export default function ContentDetailPage() {
  const insets = useSafeAreaInsets();

  return (
    <BasePage 
      useSafeArea={false}
      touchableWithoutFeedback={false}
      automaticallyAdjustKeyboardInsets={false}
      dismissKeyboardOnTap={false}
    >
      <BackButtonAppBar position="absolute" top={insets.top} left={0} right={0} zIndex={999} />
      <TabsContainer>
        <Tabs.Container
          renderHeader={HeaderComponent}
          renderTabBar={CustomTabBar}
          allowHeaderOverscroll={true}
        >
          <Tabs.Tab name="content" label="콘텐츠">
            <Tabs.ScrollView style={{ flex: 1 }}>
              <ContentTab />
            </Tabs.ScrollView>
          </Tabs.Tab>
          <Tabs.Tab name="originalInfo" label="원작 정보">
            <Tabs.ScrollView style={{ flex: 1 }}>
              <OriginalInfoTab />
            </Tabs.ScrollView>
          </Tabs.Tab>
        </Tabs.Container>
      </TabsContainer>
    </BasePage>
  );
}

/* Styled Components */
const TabsContainer = styled.View({
  flex: 1,
  backgroundColor: colors.black,
});

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

import colors from '@/shared/styles/colors';
import textStyles from '@/shared/styles/textStyles';
import styled from '@emotion/native';
import React from 'react';
import { MaterialTabBar } from 'react-native-collapsible-tab-view';

const TabBarStyleContainer = React.memo((props: any) => (
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

TabBarStyleContainer.displayName = 'TabBarStyleContainer';

export { TabBarStyleContainer };

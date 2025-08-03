import { TouchableOpacity, Dimensions } from 'react-native';
import styled from '@emotion/native';
import Animated, { useAnimatedStyle, interpolate } from 'react-native-reanimated';
import { TabBarProps } from 'react-native-collapsible-tab-view';
import colors from '@/shared/styles/colors';
import textStyles from '@/shared/styles/textStyles';

const { width: screenWidth } = Dimensions.get('window');

export const TabBar = <T extends string>({
  tabNames,
  indexDecimal,
  onTabPress,
  tabProps,
}: TabBarProps<T>) => {
  const tabWidth = screenWidth / tabNames.length;
  const indicatorWidth = tabWidth * 0.38;

  const indicatorStyle = useAnimatedStyle(() => {
    const translateX = interpolate(
      indexDecimal.value,
      tabNames.map((_, i) => i),
      tabNames.map((_, i) => i * tabWidth + (tabWidth - indicatorWidth) / 2),
    );

    return {
      transform: [{ translateX }],
    };
  });

  return (
    <TabBarContainer>
      <TabsContainer>
        {tabNames.map((name, index) => {
          const tabProp = (tabProps as any)?.[name];
          const label = tabProp?.label || name;

          return (
            <Tab key={name} onPress={() => onTabPress(name)} activeOpacity={0.7}>
              <AnimatedTabText
                style={useAnimatedStyle(() => {
                  const isActive = Math.round(indexDecimal.value) === index;
                  return {
                    color: isActive ? colors.white : colors.gray04,
                  };
                })}
              >
                {label}
              </AnimatedTabText>
            </Tab>
          );
        })}
      </TabsContainer>

      <Indicator style={indicatorStyle} width={indicatorWidth} />
    </TabBarContainer>
  );
};

/* Styled Components */
const TabBarContainer = styled.View({
  backgroundColor: colors.black,
  borderBottomWidth: 0.75,
  borderBottomColor: colors.gray06,
  position: 'relative',
});

const TabsContainer = styled.View({
  flexDirection: 'row',
  height: 48,
});

const Tab = styled(TouchableOpacity)({
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
});

const AnimatedTabText = styled(Animated.Text)({
  ...textStyles.body3,
});

const Indicator = styled(Animated.View)<{ width: number }>(({ width }) => ({
  position: 'absolute',
  bottom: 0,
  left: 0,
  width,
  height: 2,
  backgroundColor: colors.main,
}));

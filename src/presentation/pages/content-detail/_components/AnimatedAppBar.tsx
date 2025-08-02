import { BackButtonAppBar } from '@/presentation/components/app-bar';
import React, { useMemo } from 'react';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';

// 최적화된 AnimatedBackButtonAppBar 컴포넌트
const AnimatedAppBAr = React.memo(({ insets, opacity }: { insets: any; opacity: any }) => {
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
});

AnimatedAppBAr.displayName = 'AnimatedAppBAr';

export { AnimatedAppBAr };

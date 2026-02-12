import { BackButtonAppBar } from '@/presentation/components/app-bar';
import { MoreOptionsButton } from '@/presentation/components/button/MoreOptionsButton';
import React, { useMemo } from 'react';
import Animated, { SharedValue, useAnimatedStyle } from 'react-native-reanimated';
import type { EdgeInsets } from 'react-native-safe-area-context';

interface AnimatedAppBarProps {
  insets: EdgeInsets;
  opacity: SharedValue<number>;
  onMorePress: () => void;
}

// 최적화된 AnimatedBackButtonAppBar 컴포넌트
const AnimatedAppBAr = React.memo<AnimatedAppBarProps>(({ insets, opacity, onMorePress }) => {
  // backgroundColor 문자열 생성 최적화
  const animatedStyle = useAnimatedStyle(() => {
    'worklet';
    // 0일 때는 완전 투명, 1일 때는 완전 불투명
    return {
      backgroundColor: `rgba(0,0,0,${opacity.value})`,
    };
  }, [opacity]);

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

  // 액션 버튼 메모이제이션
  const actions = useMemo(
    () => [<MoreOptionsButton key="more" onPress={onMorePress} />],
    [onMorePress],
  );

  return (
    <Animated.View style={[containerStyle, animatedStyle]}>
      <BackButtonAppBar position="relative" backgroundColor="transparent" actions={actions} />
    </Animated.View>
  );
});

AnimatedAppBAr.displayName = 'AnimatedAppBAr';

export { AnimatedAppBAr };
export type { AnimatedAppBarProps };

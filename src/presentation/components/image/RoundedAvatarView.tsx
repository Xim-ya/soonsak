import React, { useState } from 'react';
import styled from '@emotion/native';
import { Animated } from 'react-native';

interface RoundedAvatorViewProps {
  source: string;
  size: number;
}

function RoundedAvatorView({ source, size }: RoundedAvatorViewProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));

  const handleImageLoad = () => {
    setIsLoading(false);
    setHasError(false);

    // 부드러운 fade-in 애니메이션
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const handleImageError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  return (
    <Container size={size}>
      {/* 로딩 중이거나 에러 시 회색 placeholder */}
      {(isLoading || hasError) && <PlaceholderView size={size} />}

      {/* 실제 이미지 - 로딩 완료 후 애니메이션과 함께 나타남 */}
      {!hasError && (
        <AnimatedAvatar
          source={{ uri: source }}
          size={size}
          onLoad={handleImageLoad}
          onError={handleImageError}
          style={{
            opacity: fadeAnim,
          }}
        />
      )}
    </Container>
  );
}

/* Styled Components */
const Container = styled.View<{ size: number }>(({ size }) => ({
  width: size,
  height: size,
  borderRadius: size / 2,
  overflow: 'hidden',
  position: 'relative',
}));

// 로딩 중 회색 placeholder
const PlaceholderView = styled.View<{ size: number }>(({ size }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  width: size,
  height: size,
  backgroundColor: '#E5E5E5', // 회색 placeholder
  borderRadius: size / 2,
}));

// 애니메이션이 적용된 이미지
const AnimatedAvatar = styled(Animated.Image)<{ size: number }>(({ size }) => ({
  width: size,
  height: size,
  position: 'absolute',
  top: 0,
  left: 0,
}));

export { RoundedAvatorView };

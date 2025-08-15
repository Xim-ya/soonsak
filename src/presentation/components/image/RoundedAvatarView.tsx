import React, { useState } from 'react';
import styled from '@emotion/native';
import { Animated } from 'react-native';
import colors from '@/shared/styles/colors';
import textStyles from '@/shared/styles/textStyles';

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
      {/* 로딩 중일 때 회색 placeholder */}
      {isLoading && <PlaceholderView size={size} />}
      
      {/* 에러 시 에러 아이콘과 텍스트 표시 */}
      {hasError && (
        <ErrorContainer size={size}>
          <ErrorIcon size={size}>?</ErrorIcon>
        </ErrorContainer>
      )}

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
  backgroundColor: colors.gray04,
  borderRadius: size / 2,
}));

// 에러 상태 컨테이너
const ErrorContainer = styled.View<{ size: number }>(({ size }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  width: size,
  height: size,
  backgroundColor: colors.gray05,
  borderRadius: size / 2,
  justifyContent: 'center',
  alignItems: 'center',
}));

// 에러 아이콘 (물음표)
const ErrorIcon = styled.Text<{ size: number }>(({ size }) => ({
  ...textStyles.body1,
  color: colors.gray02,
  fontSize: size * 0.3, // 아바타 크기의 30%
  fontWeight: 'bold',
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

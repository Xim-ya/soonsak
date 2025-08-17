/**
 * LoadableImageView - 로딩 상태와 에러 처리가 포함된 이미지 컴포넌트
 *
 * 비디오 썸네일, 포스터 이미지 등 네트워크 이미지를 표시할 때 사용합니다.
 * 이미지 로딩 중에는 placeholder를 표시하고, 로딩 완료 후 부드러운 애니메이션과 함께 이미지를 노출합니다.
 * 이미지 로딩 실패 시에는 에러 상태를 명확히 표시합니다.
 *
 * @example
 * <LoadableImageView
 *   source="https://example.com/image.jpg"
 *   width={196}
 *   height={110}
 *   borderRadius={8}
 * />
 */

import React, { useState } from 'react';
import styled from '@emotion/native';
import { Animated, ViewStyle } from 'react-native';
import colors from '@/shared/styles/colors';
import textStyles from '@/shared/styles/textStyles';

interface LoadableImageViewProps {
  source: string;
  width: number;
  height: number;
  borderRadius?: number;
  style?: ViewStyle;
}

function LoadableImageView({
  source,
  width,
  height,
  borderRadius = 4,
  style,
}: LoadableImageViewProps) {
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
    <Container width={width} height={height} borderRadius={borderRadius} style={style}>
      {/* 로딩 중일 때 회색 placeholder */}
      {isLoading && <PlaceholderView width={width} height={height} borderRadius={borderRadius} />}

      {/* 에러 시 에러 표시 */}
      {hasError && (
        <ErrorContainer width={width} height={height} borderRadius={borderRadius}>
          <ErrorIcon width={width} height={height}>
            ?
          </ErrorIcon>
        </ErrorContainer>
      )}

      {/* 실제 이미지 - 로딩 완료 후 애니메이션과 함께 나타남 */}
      {!hasError && (
        <AnimatedImage
          source={{ uri: source }}
          width={width}
          height={height}
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
const Container = styled.View<{
  width: number;
  height: number;
  borderRadius: number;
}>(({ width, height, borderRadius }) => ({
  width,
  height,
  borderRadius,
  overflow: 'hidden',
  position: 'relative',
  backgroundColor: colors.gray04,
}));

// 로딩 중 placeholder
const PlaceholderView = styled.View<{
  width: number;
  height: number;
  borderRadius: number;
}>(({ width, height, borderRadius }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  width,
  height,
  backgroundColor: colors.gray04,
  borderRadius,
}));

// 에러 상태 컨테이너
const ErrorContainer = styled.View<{
  width: number;
  height: number;
  borderRadius: number;
}>(({ width, height, borderRadius }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  width,
  height,
  backgroundColor: colors.gray05,
  borderRadius,
  justifyContent: 'center',
  alignItems: 'center',
}));

// 에러 아이콘
const ErrorIcon = styled.Text<{ width: number; height: number }>(({ width, height }) => ({
  ...textStyles.body1,
  color: colors.gray02,
  fontSize: Math.min(width, height) * 0.15, // 컨테이너 최소 크기의 15%
  fontWeight: 'bold',
}));

// 애니메이션이 적용된 이미지
const AnimatedImage = styled(Animated.Image)<{
  width: number;
  height: number;
}>(({ width, height }) => ({
  width,
  height,
  position: 'absolute',
  top: 0,
  left: 0,
}));

export { LoadableImageView };

import React from 'react';
import styled from '@emotion/native';
import colors from '@/shared/styles/colors';

interface SkeletonViewProps {
  width?: number;
  height?: number;
  borderRadius?: number;
  padding?: number;
  paddingHorizontal?: number;
  paddingVertical?: number;
  color?: string;
}

function SkeletonView({
  width,
  height,
  borderRadius = 4,
  padding,
  paddingHorizontal,
  paddingVertical,
  color = colors.gray05,
}: SkeletonViewProps) {
  const paddingStyle = {
    padding,
    paddingHorizontal,
    paddingVertical,
  };

  return (
    <Container style={paddingStyle}>
      <SkeletonBox
        {...(width !== undefined && { width })}
        {...(height !== undefined && { height })}
        borderRadius={borderRadius}
        color={color}
      />
    </Container>
  );
}

/* Styled Components */
const Container = styled.View({});

const SkeletonBox = styled.View<{
  width?: number;
  height?: number;
  borderRadius: number;
  color: string;
}>(({ width, height, borderRadius, color }) => ({
  backgroundColor: color,
  borderRadius,
  width,
  height,
}));

export { SkeletonView };

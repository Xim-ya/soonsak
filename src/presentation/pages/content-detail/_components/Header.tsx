import React from 'react';
import { TouchableHighlight } from 'react-native';
import styled from '@emotion/native';
import { DarkedLinearShadow, LinearAlign } from '../../../components/shadow/DarkedLinearShadow';
import { formatter, TmdbImageSize } from '@/shared/utils/formatter';
import PlayButtonSvg from '@assets/icons/play_button.svg';

/**
 * 콘텐츠 상세 페이지의 헤더 컴포넌트
 * 배경 이미지와 그라데이션 그림자를 포함합니다.
 */
export const Header = React.memo(() => {
  const handlePlayPress = () => {
    console.log('재생 버튼 클릭');
  };

  return (
    <HeaderContainer>
      <BackDropImage
        source={{
          uri: formatter.prefixTmdbImgUrl('5C3RriLKkIAQtQMx85JLtu4rVI2.jpg', {
            size: TmdbImageSize.original,
          }),
        }}
      />

      {/* 상단 그라데이션 그림자 */}
      <DarkedLinearShadow height={140} align={LinearAlign.topBottom} setPositionLayout={true} />

      {/* 하단 그라데이션 그림자 */}
      <DarkedLinearShadow height={88} align={LinearAlign.bottomTop} setPositionLayout={true} />

      {/* 재생 버튼 */}
      <PlayButtonContainer>
        <TouchableHighlight
          onPress={handlePlayPress}
          underlayColor="rgba(255, 255, 255, 0.02)"
          style={{
            borderRadius: 60,
          }}
        >
          <PlayButtonSvg width={120} height={120} />
        </TouchableHighlight>
      </PlayButtonContainer>
    </HeaderContainer>
  );
});

/* Styled Components */
const HeaderContainer = styled.View({
  position: 'relative',
  width: '100%',
  aspectRatio: 375 / 320,
  overflow: 'hidden',
});

const BackDropImage = styled.Image({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  width: '100%',
  height: '100%',
});

const PlayButtonContainer = styled.View({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: [{ translateX: -60 }, { translateY: -30 }],
  zIndex: 10,
});

Header.displayName = 'Header';

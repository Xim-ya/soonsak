import React from 'react';
import { TouchableHighlight } from 'react-native';
import styled from '@emotion/native';
import { DarkedLinearShadow, LinearAlign } from '../../../components/shadow/DarkedLinearShadow';
import { formatter, TmdbImageSize } from '@/shared/utils/formatter';
import PlayButtonSvg from '@assets/icons/play_button.svg';
import ContentTypeChip from '@/presentation/components/chip/ContentTypeChip';
import Gap from '@/presentation/components/view/Gap';
import { ContentType } from '@/presentation/types/content/contentType.enum';
import colors from '@/shared/styles/colors';
import textStyles from '@/shared/styles/textStyles';
import { StartRateView } from './StartRateView';

const MOCK_DATA = {
  contentType: 'movie' as ContentType,
  title: '인터스텔라',
  contentTitle: '우주선에서 혼자 90년을 살게 된 남자.. (결말포함)',
  releaseYear: 2002,
  genres: ['액션', '드라마', '스릴러'],
};

/**
 * 콘텐츠 상세 페이지의 헤더 컴포넌트
 * 배경 이미지, 그라데이션 그림자, 콘텐츠 정보를 포함합니다.
 */
export const Header = React.memo(() => {
  return (
    <HeaderContainer>
      <HeaderBackground />
      <ContentInfo />
    </HeaderContainer>
  );
});

/**
 * 헤더 배경 이미지와 재생 버튼을 포함하는 컴포넌트
 */
const HeaderBackground = React.memo(() => {
  const handlePlayPress = () => {
    console.log('재생 버튼 클릭');
  };

  return (
    <HeaderBackgroundContainer>
      <ImageWrapper>
        <BackgroundImage
          source={{
            uri: formatter.prefixTmdbImgUrl('5C3RriLKkIAQtQMx85JLtu4rVI2.jpg', {
              size: TmdbImageSize.w780,
            }),
          }}
        />
      </ImageWrapper>

      {/* 상단 그라데이션 그림자 */}
      <GradientWrapper>
        <DarkedLinearShadow height={88} align={LinearAlign.topBottom} />
      </GradientWrapper>

      {/* 하단 그라데이션 그림자 */}
      <GradientWrapper>
        <DarkedLinearShadow height={88} align={LinearAlign.bottomTop} />
      </GradientWrapper>

      {/* 재생 버튼 */}
      <PlayButtonContainer>
        <PlayButton
          onPress={handlePlayPress}
          underlayColor="rgba(255, 255, 255, 0.02)"
          delayPressIn={100}
        >
          <PlayButtonSvg width={120} height={120} />
        </PlayButton>
      </PlayButtonContainer>
    </HeaderBackgroundContainer>
  );
});

HeaderBackground.displayName = 'HeaderBackground';

/**
 * 콘텐츠 기본 정보 표시 컴포넌트
 *
 * 콘텐츠 타입, 제목, 개봉년도, 장르 리스트를 표시합니다.
 */
const ContentInfo = React.memo(() => {
  const { contentType, title, contentTitle, releaseYear, genres = [] } = MOCK_DATA;

  const dotText = ' · ';

  return (
    <ContentInfoContainer>
      <ContentTypeChip contentType={contentType} />
      <Gap size={4} />
      <Title>{title}</Title>
      <Gap size={2} />
      <SubTextView>
        <SubText>{releaseYear}</SubText>
        {genres.length > 0 && (
          <>
            <DotText>{dotText}</DotText>
            {genres.map((genre, index) => (
              <React.Fragment key={index}>
                <SubText>{genre}</SubText>
                {index < genres.length - 1 && <SubText>{dotText}</SubText>}
              </React.Fragment>
            ))}
          </>
        )}
      </SubTextView>
      <Gap size={16} />
      <ContentTitle>{contentTitle}</ContentTitle>
      <Gap size={8} />
      <RatingWrapper>
        <StartRateView rating={4.5} />
      </RatingWrapper>
    </ContentInfoContainer>
  );
});

ContentInfo.displayName = 'ContentInfo';

/* Styled Components */
const HeaderContainer = styled.View({
  backgroundColor: colors.black,
});

const HeaderBackgroundContainer = styled.View({
  position: 'relative',
  width: '100%',
  aspectRatio: 375 / 320,
  overflow: 'hidden',
});

const ImageWrapper = styled.View({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  pointerEvents: 'none' as const,
});

const GradientWrapper = styled.View({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  pointerEvents: 'none' as const,
});

const PlayButtonContainer = styled.View({
  position: 'absolute',
  top: '50%',
  left: '50%',
  width: 120,
  height: 120,
  transform: [{ translateX: -60 }, { translateY: -60 }],
  zIndex: 10,
});

const ContentInfoContainer = styled.View({
  justifyContent: 'center',
  alignItems: 'center',
  paddingVertical: 20,
});

const ContentTitle = styled.Text({
  ...textStyles.body3,
});

const SubTextView = styled.View({
  flexDirection: 'row',
  alignItems: 'center',
});

const Title = styled.Text({
  ...textStyles.headline1,
});

const SubText = styled.Text({
  ...textStyles.alert1,
  color: colors.gray01,
});

const RatingWrapper = styled.View({
  alignItems: 'center',
});

const BackgroundImage = styled.Image({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  width: '100%',
  height: '100%',
});

const PlayButton = styled(TouchableHighlight)({
  borderRadius: 60,
});

const DotText = styled.Text({
  ...textStyles.alert1,
  color: colors.white,
});

Header.displayName = 'Header';

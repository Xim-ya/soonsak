import React from 'react';
import { TouchableHighlight, Image } from 'react-native';
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
import { useContentDetail } from '../_hooks/useContentDetail';
import { SkeletonView } from '@/presentation/components/loading/SkeletonView';
import { LoadableImageView } from '@/presentation/components/image/LoadableImageView';
import { AppSize } from '@/shared/utils/appSize';

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

  const { data, isLoading, error } = useContentDetail(23);

  // 반응형 썸네일 크기 계산
  const thumbnailHeight = AppSize.ratioHeight(32);
  const thumbnailWidth = thumbnailHeight * (16 / 9);

  return (
    <HeaderBackgroundContainer>
      <ImageWrapper>
        {data && data.backdropPath && (
          <BackgroundImage
            source={{
              uri: formatter.prefixTmdbImgUrl(data.backdropPath, {
                size: TmdbImageSize.w780,
              }),
            }}
          />
        )}
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

      {/* 유튜브 썸네일 - 우측 하단 */}
      <VideoThumbnailContainer>
        <LoadableImageView
          source="https://i.ytimg.com/vi/U5TPQoEveJY/hq720.jpg"
          width={thumbnailWidth}
          height={thumbnailHeight}
          borderRadius={2}
        />
      </VideoThumbnailContainer>
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
  const { data, isLoading, error } = useContentDetail(23);

  const dotText = ' · ';

  // 로딩 중일 때 스켈레톤 UI 표시
  if (isLoading) {
    return (
      <ContentInfoContainer>
        {/* ContentTypeChip 스켈레톤 - 실제 칩과 유사한 크기 */}
        <SkeletonView width={50} height={20} borderRadius={4} />
        <Gap size={4} />

        {/* 제목 스켈레톤 - Title 스타일 컴포넌트와 동일한 높이 */}
        <TitleSkeleton>
          <SkeletonView width={180} height={28} borderRadius={4} />
        </TitleSkeleton>
        <Gap size={2} />

        {/* 연도/장르 스켈레톤 - SubTextView 구조 유지 */}
        <SubTextView>
          <SkeletonView width={200} height={16} borderRadius={4} />
        </SubTextView>
        <Gap size={16} />

        {/* 줄거리 스켈레톤 - ContentTitle과 동일한 구조 */}
        <ContentTitleSkeleton>
          <SkeletonView width={280} height={18} borderRadius={4} />
        </ContentTitleSkeleton>
        <Gap size={8} />

        {/* 별점 - 비어있는 상태로 표시 */}
        <RatingWrapper>
          <StartRateView rating={0} />
        </RatingWrapper>
      </ContentInfoContainer>
    );
  }

  // 에러 처리
  if (error || !data) {
    return (
      <ContentInfoContainer>
        <SubText>콘텐츠 정보를 불러올 수 없습니다.</SubText>
      </ContentInfoContainer>
    );
  }

  // 날짜에서 연도 추출
  const releaseYear = data.releaseDate ? new Date(data.releaseDate).getFullYear() : '';

  return (
    <ContentInfoContainer>
      <ContentTypeChip contentType={data.type as ContentType} />
      <Gap size={4} />
      <Title>{data.title}</Title>
      <Gap size={2} />
      <SubTextView>
        {releaseYear && <SubText>{releaseYear}</SubText>}
        {data.genreNames.length > 0 && (
          <>
            {releaseYear && <DotText>{dotText}</DotText>}
            {data.genreNames.map((genre, index) => (
              <React.Fragment key={index}>
                <SubText>{genre}</SubText>
                {index < data.genreNames.length - 1 && <SubText>{dotText}</SubText>}
              </React.Fragment>
            ))}
          </>
        )}
      </SubTextView>
      <Gap size={16} />
      <ContentTitle numberOfLines={1}>{'죽기 전에 꼭 봐야할 영화'}</ContentTitle>
      <Gap size={8} />
      <RatingWrapper>
        <StartRateView rating={data.voteAverage / 2} />
      </RatingWrapper>
    </ContentInfoContainer>
  );
});

ContentInfo.displayName = 'ContentInfo';

/* Styled Components */
const HeaderContainer = styled.View({
  backgroundColor: colors.black,
  pointerEvents: 'box-none' as const, // 스크롤 제스처 허용 (터치 가능한 요소가 있는 경우)
});

const HeaderBackgroundContainer = styled.View({
  position: 'relative',
  width: '100%',
  aspectRatio: 375 / 240,
  overflow: 'hidden',
  pointerEvents: 'box-none' as const, // 재생 버튼 터치는 허용하면서 스크롤도 가능하게
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

const VideoThumbnailContainer = styled.View({
  position: 'absolute',
  bottom: AppSize.ratioHeight(12),
  right: AppSize.ratioWidth(12),
  zIndex: 11,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.3,
  shadowRadius: 4,
  elevation: 5, // Android shadow
});

const ContentInfoContainer = styled.View({
  justifyContent: 'center',
  alignItems: 'center',
  paddingVertical: 20,
  paddingHorizontal: 16,
  pointerEvents: 'box-none' as const, // 스크롤 제스처 통과 허용
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

const TitleSkeleton = styled.View({
  height: 37, // headline1 lineHeight
  justifyContent: 'center',
});

const ContentTitleSkeleton = styled.View({
  height: 20, // body3 lineHeight
  justifyContent: 'center',
});

Header.displayName = 'Header';

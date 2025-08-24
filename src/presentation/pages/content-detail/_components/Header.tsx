import React, { useMemo, useCallback, useEffect, useRef } from 'react';
import { TouchableHighlight, Image, TouchableOpacity, Animated } from 'react-native';
import styled from '@emotion/native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/shared/navigation/types';
import { DarkedLinearShadow, LinearAlign } from '../../../components/shadow/DarkedLinearShadow';
import { formatter, TmdbImageSize } from '@/shared/utils/formatter';
import PlayButtonSvg from '@assets/icons/play_button.svg';
import ContentTypeChip from '@/presentation/components/chip/ContentTypeChip';
import Gap from '@/presentation/components/view/Gap';
import { ContentType } from '@/presentation/types/content/contentType.enum';
import colors from '@/shared/styles/colors';
import textStyles from '@/shared/styles/textStyles';
import { StartRateView } from './StartRateView';
import { useContentDetailTemp } from '../_hooks/useContentDetail';
import { SkeletonView } from '@/presentation/components/loading/SkeletonView';
import { LoadableImageView } from '@/presentation/components/image/LoadableImageView';
import { AppSize } from '@/shared/utils/appSize';
import { useImageTransition } from '../_hooks/useImageTransition';
import { routePages } from '@/shared/navigation/constant/routePages';
import { useYouTubeVideo } from '@/features/youtube';
import { useContentDetailRoute } from '../_hooks/useContentDetailRoute';
import { useContentDetail } from '@/features/tmdb/hooks/useContentDetail';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>; // Player 뷰

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
  const { id, type } = useContentDetailRoute();
  const {
    data: contentInfo,
    isLoading: isContentInfoLoading,
    error: contentInfoError,
  } = useContentDetail(id, type);

  const { toggleImages, opacityValues } = useImageTransition();
  const navigation = useNavigation<NavigationProp>();

  // YouTube 데이터 가져오기
  const defaultYouTubeUrl = 'https://www.youtube.com/watch?v=U5TPQoEveJY';
  const { data: videoInfo, isLoading: youtubeLoading } = useYouTubeVideo(defaultYouTubeUrl);

  // YouTube 이미지 페이드인 애니메이션
  const youtubeOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!youtubeLoading && videoInfo?.thumbnails?.high) {
      Animated.timing(youtubeOpacity, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }).start();
    } else if (youtubeLoading) {
      youtubeOpacity.setValue(0);
    }
  }, [youtubeLoading, videoInfo?.thumbnails?.high, youtubeOpacity]);

  // 메모이제이션된 값들
  const thumbnailSize = useMemo(() => {
    const height = AppSize.ratioHeight(32);
    const width = height * (16 / 9);
    return { width, height };
  }, []);

  const imageUrls = useMemo(
    () => ({
      youtube: videoInfo?.thumbnails?.high || '',
      tmdb: contentInfo?.backdropPath
        ? formatter.prefixTmdbImgUrl(contentInfo.backdropPath, { size: TmdbImageSize.w780 })
        : '',
    }),
    [contentInfo?.backdropPath, videoInfo?.thumbnails?.high],
  );

  // Movie/TV에 따른 제목 추출
  const contentTitle = contentInfo 
    ? type === 'movie' 
      ? (contentInfo as any)?.title || ''
      : (contentInfo as any)?.name || ''
    : '';

  // 이벤트 핸들러들
  const handlePlayPress = useCallback(() => {
    const title = contentTitle || '';
    const videoId = videoInfo?.id || 'U5TPQoEveJY'; // 기본값 유지
    navigation.navigate(routePages.player, {
      videoId: videoId,
      title: title,
    });
  }, [navigation, contentTitle, videoInfo?.id]);

  const handleThumbnailPress = useCallback(() => {
    toggleImages();
  }, [toggleImages]);

  return (
    <HeaderBackgroundContainer>
      <ImageWrapper>
        {/* TMDB 배경 이미지 */}
        {imageUrls.tmdb && (
          <AnimatedBackgroundImage
            source={{ uri: imageUrls.tmdb }}
            style={{ opacity: opacityValues.primary }}
          />
        )}
        {/* YouTube 배경 이미지 */}
        {imageUrls.youtube && (
          <AnimatedBackgroundImage
            source={{ uri: imageUrls.youtube }}
            style={{
              opacity: Animated.multiply(opacityValues.secondary, youtubeOpacity),
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

      {/* 비디오 썸네일 - 우측 하단 (클릭 가능) */}
      <VideoThumbnailContainer>
        <TouchableOpacity onPress={handleThumbnailPress} activeOpacity={1}>
          <ThumbnailWrapper width={thumbnailSize.width} height={thumbnailSize.height}>
            {/* TMDB 썸네일 */}
            {imageUrls.tmdb && (
              <Animated.View style={{ position: 'absolute', opacity: opacityValues.secondary }}>
                <LoadableImageView
                  source={imageUrls.tmdb}
                  width={thumbnailSize.width}
                  height={thumbnailSize.height}
                  borderRadius={2}
                />
              </Animated.View>
            )}
            {/* YouTube 썸네일 */}
            {imageUrls.youtube && (
              <Animated.View
                style={{
                  position: 'absolute',
                  opacity: Animated.multiply(opacityValues.primary, youtubeOpacity),
                }}
              >
                <LoadableImageView
                  source={imageUrls.youtube}
                  width={thumbnailSize.width}
                  height={thumbnailSize.height}
                  borderRadius={2}
                />
              </Animated.View>
            )}
          </ThumbnailWrapper>
        </TouchableOpacity>
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
  const { id, title, type } = useContentDetailRoute();
  const {
    data: contentInfo,
    isLoading: isContentInfoLoading,
    error: contentInfoError,
  } = useContentDetail(id, type);

  const dotText = ' · ';

  // Movie/TV에 따른 연도 추출
  const releaseYear = contentInfo
    ? type === 'movie' 
      ? (contentInfo as any)?.releaseDate ? formatter.dateToYear((contentInfo as any).releaseDate) : ''
      : (contentInfo as any)?.firstAirDate ? formatter.dateToYear((contentInfo as any).firstAirDate) : ''
    : '';

  // Movie/TV에 따른 평점 추출 
  const rating = contentInfo?.voteAverage ? contentInfo.voteAverage / 2 : 0;

  // route params에서 title과 type이 있으면 바로 표시 (스켈레톤 대신)
  return (
    <ContentInfoContainer>
      {/* 타입은 route params에서 바로 표시 */}
      <ContentTypeChip contentType={type} />
      <Gap size={4} />

      {/* 제목은 route params에서 바로 표시 */}
      <Title>{title}</Title>
      <Gap size={2} />

      {/* 연도/장르는 로딩 중이면 스켈레톤 */}
      {isContentInfoLoading ? (
        <SubTextView>
          <SkeletonView width={200} height={16} borderRadius={4} />
        </SubTextView>
      ) : contentInfoError ? null : (
        <SubTextView>
          {releaseYear && <SubText>{releaseYear}</SubText>}
          {contentInfo?.genres && contentInfo.genres.length > 0 && (
            <>
              {releaseYear && <DotText>{dotText}</DotText>}
              {contentInfo.genres.map((genre, index) => (
                <React.Fragment key={index}>
                  <SubText>{genre.name}</SubText>
                  {index < contentInfo.genres.length - 1 && <SubText>{dotText}</SubText>}
                </React.Fragment>
              ))}
            </>
          )}
        </SubTextView>
      )}
      <Gap size={16} />

      {/* 컨텐츠 타이틀 */}
      <ContentTitle numberOfLines={1}>{'죽기 전에 꼭 봐야할 영화'}</ContentTitle>
      <Gap size={8} />

      {/* 별점은 로딩 중이면 0, 데이터 있으면 표시 */}
      <RatingWrapper>
        <StartRateView rating={rating} />
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

const AnimatedBackgroundImage = styled(Animated.Image)({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  width: '100%',
  height: '100%',
});

const ThumbnailWrapper = styled.View<{ width: number; height: number }>(({ width, height }) => ({
  width,
  height,
  position: 'relative',
  overflow: 'hidden',
  borderRadius: 2,
}));

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

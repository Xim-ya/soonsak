import React, { useCallback } from 'react';
import { ScrollView, TouchableOpacity } from 'react-native';
import styled from '@emotion/native';
import { useRoute, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ScreenRouteProp, RootStackParamList } from '@/shared/navigation/types';
import { routePages } from '@/shared/navigation/constant/routePages';
import { useContentImages } from '@/features/tmdb/hooks/useContentImages';
import { useYouTubeVideo, buildYouTubeUrl } from '@/features/youtube';
import { BasePage } from '@/presentation/components/page';
import { BackButtonAppBar } from '@/presentation/components/app-bar/BackButtonAppBar';
import { LoadableImageView } from '@/presentation/components/image/LoadableImageView';
import { ImageGrid } from '@/presentation/components/image/ImageGrid';
import {
  DarkedLinearShadow,
  LinearAlign,
} from '@/presentation/components/shadow/DarkedLinearShadow';
import { AppSize } from '@/shared/utils/appSize';
import colors from '@/shared/styles/colors';
import textStyles from '@/shared/styles/textStyles';

type MediaListRouteProp = ScreenRouteProp<typeof routePages.mediaList>;
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const HORIZONTAL_PADDING = 16;
const IMAGE_GAP = 4;

function MediaListPageComponent() {
  const route = useRoute<MediaListRouteProp>();
  const navigation = useNavigation<NavigationProp>();
  const { contentId, contentType, backdropPath, title, primaryVideoId, primaryVideoTitle } =
    route.params;

  const { data: images } = useContentImages(contentId, contentType, backdropPath);

  // 영상 배너용 YouTube 썸네일
  const youtubeUrl = primaryVideoId ? buildYouTubeUrl(primaryVideoId) : undefined;
  const { data: videoInfo } = useYouTubeVideo(youtubeUrl);
  const bannerThumbnail = videoInfo?.thumbnails?.high || videoInfo?.thumbnails?.default;

  const containerWidth = AppSize.screenWidth - HORIZONTAL_PADDING * 2;
  const gridItemWidth = (containerWidth - IMAGE_GAP) / 2;
  const gridItemHeight = gridItemWidth * (9 / 16);
  const bannerHeight = containerWidth * (9 / 16);

  const handleImagePress = useCallback(
    (index: number) => {
      navigation.navigate(routePages.imageDetail, {
        contentId,
        contentType,
        backdropPath,
        initialIndex: index,
      });
    },
    [navigation, contentId, contentType, backdropPath],
  );

  const handleBannerPress = useCallback(() => {
    if (!primaryVideoId) return;
    navigation.navigate(routePages.player, {
      videoId: primaryVideoId,
      title: primaryVideoTitle || title || '',
      contentId,
      contentType,
    });
  }, [navigation, primaryVideoId, primaryVideoTitle, title, contentId, contentType]);

  return (
    <BasePage useSafeArea safeAreaBottom={false}>
      <BackButtonAppBar title="미디어" centerAligned />

      <ScrollView>
        {/* 영상 배너 */}
        {primaryVideoId && bannerThumbnail && (
          <TouchableOpacity activeOpacity={0.8} onPress={handleBannerPress}>
            <BannerContainer>
              <LoadableImageView
                source={bannerThumbnail}
                width={AppSize.screenWidth}
                height={bannerHeight + HORIZONTAL_PADDING * 2}
                borderRadius={0}
              />
              <BannerOverlay>
                <DarkedLinearShadow height={80} align={LinearAlign.bottomTop} />
              </BannerOverlay>
              <BannerTextContainer>
                <BannerLabel>공식 예고편</BannerLabel>
              </BannerTextContainer>
            </BannerContainer>
          </TouchableOpacity>
        )}

        {/* 이미지 서브섹션 */}
        <ImageSectionContainer>
          <SubSectionTitle>이미지</SubSectionTitle>

          <ImageGrid
            images={images}
            itemWidth={gridItemWidth}
            itemHeight={gridItemHeight}
            gap={IMAGE_GAP}
            onImagePress={handleImagePress}
          />
        </ImageSectionContainer>
      </ScrollView>
    </BasePage>
  );
}

const BannerContainer = styled.View({
  position: 'relative',
  width: '100%',
});

const BannerOverlay = styled.View({
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
});

const BannerTextContainer = styled.View({
  position: 'absolute',
  bottom: 12,
  left: HORIZONTAL_PADDING,
});

const BannerLabel = styled.Text({
  ...textStyles.body2,
  color: colors.white,
  fontWeight: 'bold',
});

const ImageSectionContainer = styled.View({
  paddingHorizontal: HORIZONTAL_PADDING,
  paddingTop: 20,
  paddingBottom: 40,
});

const SubSectionTitle = styled.Text({
  ...textStyles.title2,
  color: colors.white,
  marginBottom: 10,
});

export const MediaListPage = React.memo(MediaListPageComponent);
MediaListPage.displayName = 'MediaListPage';

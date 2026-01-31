import React, { useMemo, useCallback } from 'react';
import { TouchableOpacity } from 'react-native';
import styled from '@emotion/native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/shared/navigation/types';
import { routePages } from '@/shared/navigation/constant/routePages';
import { useContentImages } from '@/features/tmdb/hooks/useContentImages';
import { useContentDetailRoute } from '../_hooks/useContentDetailRoute';
import { useContentDetail } from '../_hooks/useContentDetail';
import { useContentVideos } from '../_provider/ContentDetailProvider';
import { LoadableImageView } from '@/presentation/components/image/LoadableImageView';
import { ImageGrid } from '@/presentation/components/image/ImageGrid';
import { formatter, TmdbImageSize } from '@/shared/utils/formatter';
import { AppSize } from '@/shared/utils/appSize';
import colors from '@/shared/styles/colors';
import textStyles from '@/shared/styles/textStyles';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const HORIZONTAL_PADDING = 16;
const IMAGE_GAP = 6;
const PREVIEW_COUNT = 5;

function MediaSectionViewComponent() {
  const { id, type } = useContentDetailRoute();
  const { data: contentInfo } = useContentDetail(Number(id), type);
  const { primaryVideo } = useContentVideos();
  const navigation = useNavigation<NavigationProp>();

  const backdropPath = contentInfo?.backdropPath || '';
  const { data: images } = useContentImages(Number(id), type, backdropPath);

  const containerWidth = AppSize.screenWidth - HORIZONTAL_PADDING * 2;
  const gridItemWidth = (containerWidth - IMAGE_GAP) / 2;
  const heroImageHeight = containerWidth * (9 / 16);
  const gridItemHeight = gridItemWidth * (9 / 16);

  const heroImage = images[0];
  const gridImages = useMemo(() => images.slice(1, PREVIEW_COUNT), [images]);
  const hasMoreImages = images.length > PREVIEW_COUNT;

  const handleImagePress = useCallback(
    (index: number) => {
      navigation.navigate(routePages.imageDetail, {
        contentId: Number(id),
        contentType: type,
        backdropPath,
        initialIndex: index,
      });
    },
    [navigation, id, type, backdropPath],
  );

  const handleGridImagePress = useCallback(
    (index: number) => {
      // gridImages starts at index 1 of the full list
      handleImagePress(index);
    },
    [handleImagePress],
  );

  const handleMorePress = useCallback(() => {
    const params: RootStackParamList[typeof routePages.mediaList] = {
      contentId: Number(id),
      contentType: type,
      backdropPath,
      title: contentInfo?.title || '',
      ...(primaryVideo?.id ? { primaryVideoId: primaryVideo.id } : {}),
      ...(primaryVideo?.title ? { primaryVideoTitle: primaryVideo.title } : {}),
    };
    navigation.navigate(routePages.mediaList, params);
  }, [
    navigation,
    id,
    type,
    backdropPath,
    contentInfo?.title,
    primaryVideo?.id,
    primaryVideo?.title,
  ]);

  if (!heroImage) return null;

  return (
    <Container>
      <SectionTitle>미디어</SectionTitle>

      {/* 대형 이미지 (풀 너비, 16:9) */}
      <TouchableOpacity activeOpacity={0.8} onPress={() => handleImagePress(0)}>
        <LoadableImageView
          source={formatter.prefixTmdbImgUrl(heroImage.filePath, { size: TmdbImageSize.w780 })}
          width={containerWidth}
          height={heroImageHeight}
          borderRadius={4}
        />
      </TouchableOpacity>

      {/* 2열 그리드 (나머지 이미지) */}
      {gridImages.length > 0 && (
        <GridWrapper>
          <ImageGrid
            images={gridImages}
            itemWidth={gridItemWidth}
            itemHeight={gridItemHeight}
            gap={IMAGE_GAP}
            onImagePress={handleGridImagePress}
            indexOffset={1}
          />
        </GridWrapper>
      )}

      {/* 더보기 버튼 */}
      {hasMoreImages && (
        <MoreButtonRow>
          <TouchableOpacity onPress={handleMorePress} activeOpacity={0.6}>
            <MoreButtonText>더보기 {'>'}</MoreButtonText>
          </TouchableOpacity>
        </MoreButtonRow>
      )}
    </Container>
  );
}

const Container = styled.View({
  paddingHorizontal: HORIZONTAL_PADDING,
  paddingTop: 24,
});

const SectionTitle = styled.Text({
  ...textStyles.title2,
  color: colors.white,
  marginBottom: 10,
});

const GridWrapper = styled.View({
  marginTop: IMAGE_GAP,
});

const MoreButtonRow = styled.View({
  alignItems: 'flex-end',
  marginTop: 12,
});

const MoreButtonText = styled.Text({
  ...textStyles.alert1,
  color: colors.gray02,
});

export const MediaSectionView = React.memo(MediaSectionViewComponent);
MediaSectionView.displayName = 'MediaSectionView';

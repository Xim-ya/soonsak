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
  const smallImageWidth = (containerWidth - IMAGE_GAP) / 2;
  const largeImageHeight = containerWidth * (9 / 16);
  const smallImageHeight = smallImageWidth * (9 / 16);

  const previewImages = useMemo(() => images.slice(0, PREVIEW_COUNT), [images]);

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

  const handleMorePress = useCallback(() => {
    navigation.navigate(routePages.mediaList, {
      contentId: Number(id),
      contentType: type,
      backdropPath,
      title: contentInfo?.title || '',
      ...(primaryVideo?.id ? { primaryVideoId: primaryVideo.id } : {}),
      ...(primaryVideo?.title ? { primaryVideoTitle: primaryVideo.title } : {}),
    });
  }, [navigation, id, type, backdropPath, contentInfo?.title, primaryVideo?.id, primaryVideo?.title]);

  const firstImage = previewImages[0];
  const restImages = previewImages.slice(1);

  if (!firstImage) return null;

  return (
    <Container>
      <SectionTitle>미디어</SectionTitle>

      {/* 대형 이미지 (풀 너비, 16:9) */}
      <TouchableOpacity activeOpacity={0.8} onPress={() => handleImagePress(0)}>
        <LoadableImageView
          source={formatter.prefixTmdbImgUrl(firstImage.filePath, { size: TmdbImageSize.w780 })}
          width={containerWidth}
          height={largeImageHeight}
          borderRadius={4}
        />
      </TouchableOpacity>

      {/* 2열 그리드 (나머지 이미지) */}
      {restImages.length > 0 && (
        <GridContainer>
          {restImages.map((image, index) => (
            <TouchableOpacity
              key={image.filePath}
              activeOpacity={0.8}
              onPress={() => handleImagePress(index + 1)}
              style={{
                marginLeft: index % 2 === 1 ? IMAGE_GAP : 0,
                marginTop: IMAGE_GAP,
              }}
            >
              <LoadableImageView
                source={formatter.prefixTmdbImgUrl(image.filePath, { size: TmdbImageSize.w780 })}
                width={smallImageWidth}
                height={smallImageHeight}
                borderRadius={4}
              />
            </TouchableOpacity>
          ))}
        </GridContainer>
      )}

      {/* 더보기 버튼 */}
      {images.length > PREVIEW_COUNT && (
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

const GridContainer = styled.View({
  flexDirection: 'row',
  flexWrap: 'wrap',
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

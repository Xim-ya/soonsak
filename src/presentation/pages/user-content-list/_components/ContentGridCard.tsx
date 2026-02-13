import { memo, useCallback } from 'react';
import styled from '@emotion/native';
import { Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LoadableImageView } from '@/presentation/components/image/LoadableImageView';
import ContentTypeChip from '@/presentation/components/chip/ContentTypeChip';
import type { RootStackParamList } from '@/shared/navigation/types';
import { routePages } from '@/shared/navigation/constant/routePages';
import { formatter, TmdbImageSize } from '@/shared/utils/formatter';
import colors from '@/shared/styles/colors';
import textStyles from '@/shared/styles/textStyles';
import { AppSize } from '@/shared/utils/appSize';
import type { UserContentItem } from '../_types';
import { RatingOverlay } from './RatingOverlay';

interface ContentGridCardProps {
  item: UserContentItem;
  showRating?: boolean;
}

// 3열 그리드: (화면너비 - 좌우패딩32 - 간격18) / 3
const ITEM_WIDTH = (AppSize.screenWidth - 32 - 18) / 3;
const POSTER_HEIGHT = ITEM_WIDTH * 1.5;

/**
 * 콘텐츠 그리드 카드 컴포넌트
 * 3열 그리드 레이아웃용 포스터 + 제목 카드
 */
function ContentGridCardComponent({ item, showRating = false }: ContentGridCardProps) {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const posterUrl = formatter.prefixTmdbImgUrl(item.contentPosterPath, {
    size: TmdbImageSize.w342,
  });

  const handlePress = useCallback(() => {
    navigation.navigate(routePages.contentDetail, {
      id: item.contentId,
      title: item.contentTitle,
      type: item.contentType,
    });
  }, [navigation, item.contentId, item.contentTitle, item.contentType]);

  return (
    <Container>
      <Pressable onPress={handlePress}>
        <PosterWrapper>
          <LoadableImageView
            source={posterUrl}
            width={ITEM_WIDTH}
            height={POSTER_HEIGHT}
            borderRadius={4}
          />
          <ChipWrapper>
            <ContentTypeChip contentType={item.contentType} />
          </ChipWrapper>
          {showRating && item.rating != null && <RatingOverlay rating={item.rating} />}
        </PosterWrapper>
        <TitleWrapper>
          <ContentTitle numberOfLines={2}>{item.contentTitle || '제목 없음'}</ContentTitle>
        </TitleWrapper>
      </Pressable>
    </Container>
  );
}

const Container = styled.View({
  width: ITEM_WIDTH,
  marginBottom: 24,
});

const PosterWrapper = styled.View({
  position: 'relative',
});

const ChipWrapper = styled.View({
  position: 'absolute',
  left: 5,
  top: 6,
});

const TitleWrapper = styled.View({
  marginTop: 8,
  height: 28,
});

const ContentTitle = styled.Text({
  ...textStyles.desc,
  color: colors.gray01,
  lineHeight: 14,
});

export const ContentGridCard = memo(ContentGridCardComponent);

/**
 * WatchHistoryList - 시청 기록 목록
 *
 * 시청한 작품들을 가로 스크롤 리스트로 표시합니다.
 * - 포스터 이미지 + 제목
 * - 중복 제거된 고유 콘텐츠만 표시
 */

import { memo, useCallback } from 'react';
import { FlatList, ListRenderItem, TouchableOpacity } from 'react-native';
import styled from '@emotion/native';
import colors from '@/shared/styles/colors';
import textStyles from '@/shared/styles/textStyles';
import { AppSize } from '@/shared/utils/appSize';
import { LoadableImageView } from '@/presentation/components/image/LoadableImageView';
import { formatter, TmdbImageSize } from '@/shared/utils/formatter';
import type { WatchHistoryWithContentDto } from '@/features/watch-history';

/* Types */

interface WatchHistoryListProps {
  readonly items: WatchHistoryWithContentDto[];
  readonly isLoading?: boolean;
  readonly onItemPress?: (item: WatchHistoryWithContentDto) => void;
}

interface WatchHistoryItemProps {
  readonly item: WatchHistoryWithContentDto;
  readonly onItemPress: ((item: WatchHistoryWithContentDto) => void) | undefined;
}

/* Constants */

const ITEM_WIDTH = AppSize.ratioWidth(100);
const ITEM_HEIGHT = ITEM_WIDTH * (150 / 100);
const ITEM_GAP = AppSize.ratioWidth(8);
const HORIZONTAL_PADDING = AppSize.ratioWidth(16);

const LIST_CONTENT_STYLE = {
  paddingHorizontal: HORIZONTAL_PADDING,
};

/* Components */

const WatchHistoryItemComponent = memo(({ item, onItemPress }: WatchHistoryItemProps) => {
  const posterUrl = item.contentPosterPath
    ? formatter.prefixTmdbImgUrl(item.contentPosterPath, { size: TmdbImageSize.w185 })
    : '';

  const handlePress = useCallback(() => {
    onItemPress?.(item);
  }, [onItemPress, item]);

  return (
    <ItemContainer>
      <TouchableOpacity onPress={handlePress} activeOpacity={0.7}>
        <LoadableImageView
          source={posterUrl}
          width={ITEM_WIDTH}
          height={ITEM_HEIGHT}
          borderRadius={4}
        />
        <ItemTitle numberOfLines={1}>{item.contentTitle}</ItemTitle>
      </TouchableOpacity>
    </ItemContainer>
  );
});

function WatchHistoryListComponent({
  items,
  isLoading = false,
  onItemPress,
}: WatchHistoryListProps) {
  const renderItem: ListRenderItem<WatchHistoryWithContentDto> = useCallback(
    ({ item }) => <WatchHistoryItemComponent item={item} onItemPress={onItemPress} />,
    [onItemPress],
  );

  const keyExtractor = useCallback(
    (item: WatchHistoryWithContentDto) => `${item.id}-${item.contentId}`,
    [],
  );

  if (items.length === 0 && !isLoading) {
    return null;
  }

  return (
    <Container>
      <SectionTitle>시청기록</SectionTitle>
      <FlatList
        horizontal
        data={items}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={LIST_CONTENT_STYLE}
        ItemSeparatorComponent={ItemSeparator}
      />
    </Container>
  );
}

/* Styled Components */

const Container = styled.View({
  paddingVertical: AppSize.ratioHeight(16),
});

const SectionTitle = styled.Text({
  ...textStyles.title1,
  color: colors.white,
  marginBottom: AppSize.ratioHeight(12),
  paddingHorizontal: HORIZONTAL_PADDING,
});

const ItemSeparator = () => <SeparatorView />;

const SeparatorView = styled.View({
  width: ITEM_GAP,
});

const ItemContainer = styled.View({
  width: ITEM_WIDTH,
});

const ItemTitle = styled.Text({
  ...textStyles.desc,
  color: colors.white,
  marginTop: AppSize.ratioHeight(6),
});

export const WatchHistoryList = memo(WatchHistoryListComponent);

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
import type { WatchHistoryModelType } from '@/features/watch-history';
import {
  shouldShowProgressBar,
  calculateProgressPercent,
} from '@/presentation/components/progress';
import DarkChip from '@/presentation/components/chip/DarkChip';
import { useAuth } from '@/shared/providers/AuthProvider';

/* Types */

interface WatchHistoryListProps {
  readonly items: WatchHistoryModelType[];
  readonly isLoading?: boolean;
  readonly onItemPress?: (item: WatchHistoryModelType) => void;
}

interface WatchHistoryItemProps {
  readonly item: WatchHistoryModelType;
  readonly onItemPress: ((item: WatchHistoryModelType) => void) | undefined;
}

/* Constants */

const ITEM_WIDTH = AppSize.ratioWidth(160);
const ITEM_HEIGHT = ITEM_WIDTH * (9 / 16); // 16:9 비율 (백드롭용)
const ITEM_GAP = AppSize.ratioWidth(8);
const HORIZONTAL_PADDING = AppSize.ratioWidth(16);
const PROGRESS_BAR_HEIGHT = 3;

const LIST_CONTENT_STYLE = {
  paddingHorizontal: HORIZONTAL_PADDING,
};

/* Components */

const WatchHistoryItemComponent = memo(({ item, onItemPress }: WatchHistoryItemProps) => {
  // 백드롭 이미지 우선, 없으면 포스터 사용
  const imageUrl = item.contentBackdropPath
    ? formatter.prefixTmdbImgUrl(item.contentBackdropPath, { size: TmdbImageSize.w342 })
    : item.contentPosterPath
      ? formatter.prefixTmdbImgUrl(item.contentPosterPath, { size: TmdbImageSize.w185 })
      : '';

  // YouTube 스타일 프로그레스 바 표시 여부 (공통 정책 적용)
  const showProgressBar = shouldShowProgressBar(item.progressSeconds, item.durationSeconds);

  // 진행률 계산 (0~100) - 공통 유틸리티 사용
  const progressPercent = calculateProgressPercent(item.progressSeconds, item.durationSeconds);

  const handlePress = useCallback(() => {
    onItemPress?.(item);
  }, [onItemPress, item]);

  return (
    <ItemContainer>
      <TouchableOpacity onPress={handlePress} activeOpacity={0.7}>
        <ImageWrapper>
          <LoadableImageView
            source={imageUrl}
            width={ITEM_WIDTH}
            height={ITEM_HEIGHT}
            borderRadius={4}
          />
          {/* 런타임 칩 - 우측 하단 */}
          {item.durationSeconds > 0 && (
            <RuntimeChipContainer>
              <DarkChip content={formatter.formatRuntime(item.durationSeconds)} />
            </RuntimeChipContainer>
          )}
          {showProgressBar && (
            <ProgressBarContainer>
              <ProgressBarBackground />
              <ProgressBarFill style={{ width: `${progressPercent}%` }} />
            </ProgressBarContainer>
          )}
        </ImageWrapper>
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
  const { status } = useAuth();

  const isGuest = status === 'unauthenticated';
  const hasNoHistory = items.length === 0 && !isLoading;

  const renderItem: ListRenderItem<WatchHistoryModelType> = useCallback(
    ({ item }) => <WatchHistoryItemComponent item={item} onItemPress={onItemPress} />,
    [onItemPress],
  );

  const keyExtractor = useCallback(
    (item: WatchHistoryModelType) => `${item.id}-${item.contentId}`,
    [],
  );

  // 비로그인 유저: 빈 상태 메시지
  if (isGuest) {
    return (
      <Container>
        <SectionTitle>시청기록</SectionTitle>
        <EmptyStateContainer>
          <EmptyStateText>로그인하면 시청기록이 저장돼요</EmptyStateText>
        </EmptyStateContainer>
      </Container>
    );
  }

  // 로그인 유저 + 기록 없음
  if (hasNoHistory) {
    return (
      <Container>
        <SectionTitle>시청기록</SectionTitle>
        <EmptyStateContainer>
          <EmptyStateText>아직 시청한 작품이 없어요</EmptyStateText>
        </EmptyStateContainer>
      </Container>
    );
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

const EmptyStateContainer = styled.View({
  height: ITEM_HEIGHT,
  justifyContent: 'center',
  alignItems: 'center',
  paddingHorizontal: HORIZONTAL_PADDING,
});

const EmptyStateText = styled.Text({
  ...textStyles.body2,
  color: colors.gray02,
});

const ItemSeparator = () => <SeparatorView />;

const SeparatorView = styled.View({
  width: ITEM_GAP,
});

const ItemContainer = styled.View({
  width: ITEM_WIDTH,
});

const ImageWrapper = styled.View({
  position: 'relative',
  width: ITEM_WIDTH,
  height: ITEM_HEIGHT,
  borderRadius: 4,
  overflow: 'hidden',
});

const RuntimeChipContainer = styled.View({
  position: 'absolute',
  bottom: 6,
  right: 6,
  zIndex: 1,
});

const ProgressBarContainer = styled.View({
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  height: PROGRESS_BAR_HEIGHT,
});

const ProgressBarBackground = styled.View({
  position: 'absolute',
  width: '100%',
  height: '100%',
  backgroundColor: 'rgba(255, 255, 255, 0.3)',
});

const ProgressBarFill = styled.View({
  position: 'absolute',
  height: '100%',
  backgroundColor: '#FF0000', // YouTube 빨간색
});

const ItemTitle = styled.Text({
  ...textStyles.desc,
  color: colors.white,
  marginTop: AppSize.ratioHeight(6),
});

export const WatchHistoryList = memo(WatchHistoryListComponent);

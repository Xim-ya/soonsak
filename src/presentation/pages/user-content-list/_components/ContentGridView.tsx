import React, { useMemo, useCallback } from 'react';
import { Tabs } from 'react-native-collapsible-tab-view';
import styled from '@emotion/native';
import { SkeletonView } from '@/presentation/components/loading/SkeletonView';
import colors from '@/shared/styles/colors';
import textStyles from '@/shared/styles/textStyles';
import type { UserContentItem } from '../_types';
import {
  MemoizedContentGridItem,
  GRID_ITEM_WIDTH,
  GRID_POSTER_HEIGHT,
  GRID_COLUMN_GAP,
} from './ContentGridItem';

interface ContentGridViewProps {
  readonly items: UserContentItem[];
  readonly isLoading: boolean;
  readonly hasMore: boolean;
  readonly emptyMessage: string;
  readonly emptySubMessage: string;
  readonly showRating?: boolean;
  readonly onEndReached?: () => void;
}

/**
 * ContentGridView - 콘텐츠 그리드 뷰
 *
 * 3열 그리드로 콘텐츠 목록을 표시합니다.
 * 로딩, 빈 상태, 무한 스크롤을 처리합니다.
 */
function ContentGridView({
  items,
  isLoading,
  hasMore,
  emptyMessage,
  emptySubMessage,
  showRating = false,
  onEndReached,
}: ContentGridViewProps) {
  const isEmpty = !isLoading && items.length === 0;

  // 3열 그리드로 아이템 그룹화
  const rows = useMemo(() => {
    const result: UserContentItem[][] = [];
    for (let i = 0; i < items.length; i += 3) {
      result.push(items.slice(i, i + 3));
    }
    return result;
  }, [items]);

  const handleScroll = useCallback(
    (event: {
      nativeEvent: {
        contentOffset: { y: number };
        layoutMeasurement: { height: number };
        contentSize: { height: number };
      };
    }) => {
      const { contentOffset, layoutMeasurement, contentSize } = event.nativeEvent;
      const isNearBottom = contentOffset.y + layoutMeasurement.height >= contentSize.height - 200;

      if (isNearBottom && hasMore && !isLoading && onEndReached) {
        onEndReached();
      }
    },
    [hasMore, isLoading, onEndReached],
  );

  // 스켈레톤 로딩 UI (3x3 그리드)
  if (isLoading && items.length === 0) {
    return (
      <Tabs.ScrollView style={{ flex: 1 }}>
        <GridContainer>
          {Array.from({ length: 3 }).map((_, rowIndex) => (
            <Row key={rowIndex}>
              {Array.from({ length: 3 }).map((_, colIndex) => (
                <SkeletonItemContainer key={colIndex}>
                  <SkeletonView
                    width={GRID_ITEM_WIDTH}
                    height={GRID_POSTER_HEIGHT}
                    borderRadius={4}
                  />
                </SkeletonItemContainer>
              ))}
            </Row>
          ))}
        </GridContainer>
      </Tabs.ScrollView>
    );
  }

  // 빈 상태 UI
  if (isEmpty) {
    return (
      <Tabs.ScrollView style={{ flex: 1 }}>
        <EmptyContainer>
          <EmptyText>{emptyMessage}</EmptyText>
          <EmptySubText>{emptySubMessage}</EmptySubText>
        </EmptyContainer>
      </Tabs.ScrollView>
    );
  }

  return (
    <Tabs.ScrollView style={{ flex: 1 }} onScroll={handleScroll} scrollEventThrottle={16}>
      <GridContainer>
        {rows.map((row, rowIndex) => (
          <Row key={rowIndex}>
            {row.map((item) => (
              <MemoizedContentGridItem key={item.id} item={item} showRating={showRating} />
            ))}
            {/* 마지막 행이 3개 미만일 때 빈 공간 채우기 */}
            {row.length < 3 &&
              Array.from({ length: 3 - row.length }).map((_, idx) => (
                <EmptyGridItem key={`empty-${idx}`} />
              ))}
          </Row>
        ))}
        {/* 추가 로딩 인디케이터 */}
        {isLoading && items.length > 0 && (
          <LoadingMoreContainer>
            <Row>
              {Array.from({ length: 3 }).map((_, idx) => (
                <SkeletonItemContainer key={idx}>
                  <SkeletonView
                    width={GRID_ITEM_WIDTH}
                    height={GRID_POSTER_HEIGHT}
                    borderRadius={4}
                  />
                </SkeletonItemContainer>
              ))}
            </Row>
          </LoadingMoreContainer>
        )}
      </GridContainer>
    </Tabs.ScrollView>
  );
}

/* Styled Components */
const GridContainer = styled.View({
  paddingHorizontal: 16,
  paddingTop: 20,
  paddingBottom: 40,
});

const Row = styled.View({
  flexDirection: 'row',
  justifyContent: 'space-between',
  gap: GRID_COLUMN_GAP,
});

const SkeletonItemContainer = styled.View({
  width: GRID_ITEM_WIDTH,
  marginBottom: 12,
});

const EmptyGridItem = styled.View({
  width: GRID_ITEM_WIDTH,
});

const EmptyContainer = styled.View({
  flex: 1,
  alignItems: 'center',
  justifyContent: 'center',
  paddingVertical: 100,
  paddingHorizontal: 24,
});

const EmptyText = styled.Text({
  ...textStyles.title2,
  color: colors.white,
  marginBottom: 8,
});

const EmptySubText = styled.Text({
  ...textStyles.body2,
  color: colors.gray02,
  textAlign: 'center',
});

const LoadingMoreContainer = styled.View({
  marginTop: 8,
});

export const MemoizedContentGridView = React.memo(ContentGridView);

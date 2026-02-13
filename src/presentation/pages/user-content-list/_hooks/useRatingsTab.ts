import { useState, useCallback, useEffect } from 'react';
import { useRatingsList } from '@/features/ratings';
import type { UserContentItem } from '../_types';

const PAGE_SIZE = 20;

interface UseRatingsTabResult {
  items: UserContentItem[];
  isLoading: boolean;
  hasMore: boolean;
  totalCount: number;
  fetchNextPage: () => void;
}

/**
 * 평가했어요 탭 데이터 Hook
 * 무한 스크롤을 지원하며 탭 내부에서 독립적으로 동작
 */
export function useRatingsTab(): UseRatingsTabResult {
  const [offset, setOffset] = useState(0);
  const [accumulatedItems, setAccumulatedItems] = useState<UserContentItem[]>([]);
  const [isFetchingNextPage, setIsFetchingNextPage] = useState(false);

  const query = useRatingsList(PAGE_SIZE, offset);

  // 데이터가 변경되면 누적
  useEffect(() => {
    if (query.data && !query.isLoading) {
      const newItems: UserContentItem[] = query.data.items.map((item) => ({
        id: item.id,
        contentId: item.contentId,
        contentType: item.contentType,
        contentTitle: item.contentTitle,
        contentPosterPath: item.contentPosterPath,
        rating: item.rating,
      }));

      if (offset === 0) {
        setAccumulatedItems(newItems);
      } else {
        setAccumulatedItems((prev) => [...prev, ...newItems]);
      }
      setIsFetchingNextPage(false);
    }
  }, [query.data, query.isLoading, offset]);

  const fetchNextPage = useCallback(() => {
    if (query.data?.hasMore && !query.isLoading && !isFetchingNextPage) {
      setIsFetchingNextPage(true);
      setOffset((prev) => prev + PAGE_SIZE);
    }
  }, [query.data?.hasMore, query.isLoading, isFetchingNextPage]);

  return {
    items: accumulatedItems,
    isLoading: query.isLoading && offset === 0,
    hasMore: query.data?.hasMore ?? false,
    totalCount: query.data?.totalCount ?? 0,
    fetchNextPage,
  };
}

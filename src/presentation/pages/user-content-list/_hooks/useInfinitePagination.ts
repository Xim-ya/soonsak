import { useState, useCallback, useEffect } from 'react';
import type { UseQueryResult } from '@tanstack/react-query';
import type { UserContentItem } from '../_types';

const PAGE_SIZE = 20;

/**
 * 페이지네이션 응답 타입 (공통 인터페이스)
 */
interface PaginatedResponse<T> {
  items: T[];
  hasMore: boolean;
  totalCount: number;
}

/**
 * 아이템 매퍼 함수 타입
 */
type ItemMapper<TSource> = (item: TSource) => UserContentItem;

interface UseInfinitePaginationResult {
  items: UserContentItem[];
  isLoading: boolean;
  hasMore: boolean;
  totalCount: number;
  fetchNextPage: () => void;
}

interface UseInfinitePaginationOptions<TSource> {
  /** Query hook을 호출하는 함수 */
  useQueryHook: (
    limit: number,
    offset: number,
  ) => UseQueryResult<PaginatedResponse<TSource>, Error>;
  /** 소스 아이템을 UserContentItem으로 변환하는 함수 */
  mapItem: ItemMapper<TSource>;
}

/**
 * useInfinitePagination - 무한 스크롤 페이지네이션 공통 Hook
 *
 * 찜/평가/시청완료 탭에서 공통으로 사용하는 페이지네이션 로직을 추상화합니다.
 * - 데이터 누적 관리
 * - 페이지 오프셋 관리
 * - 로딩 상태 관리
 *
 * @example
 * ```typescript
 * const mapItem = useCallback((item) => ({
 *   id: item.id,
 *   contentId: item.contentId,
 *   // ...
 * }), []);
 *
 * return useInfinitePagination({
 *   useQueryHook: useFavoritesList,
 *   mapItem,
 * });
 * ```
 */
export function useInfinitePagination<TSource>({
  useQueryHook,
  mapItem,
}: UseInfinitePaginationOptions<TSource>): UseInfinitePaginationResult {
  const [offset, setOffset] = useState(0);
  const [accumulatedItems, setAccumulatedItems] = useState<UserContentItem[]>([]);
  const [isFetchingNextPage, setIsFetchingNextPage] = useState(false);

  const query = useQueryHook(PAGE_SIZE, offset);

  const isInitialLoading = query.isLoading && offset === 0;

  // 데이터가 변경되면 누적
  useEffect(() => {
    if (query.data && !query.isLoading) {
      const newItems = query.data.items.map(mapItem);

      setAccumulatedItems((prev) => (offset === 0 ? newItems : [...prev, ...newItems]));
      setIsFetchingNextPage(false);
    }
  }, [query.data, query.isLoading, offset, mapItem]);

  const fetchNextPage = useCallback(() => {
    const canFetchNext = query.data?.hasMore && !query.isLoading && !isFetchingNextPage;

    if (canFetchNext) {
      setIsFetchingNextPage(true);
      setOffset((prev) => prev + PAGE_SIZE);
    }
  }, [query.data?.hasMore, query.isLoading, isFetchingNextPage]);

  return {
    items: accumulatedItems,
    isLoading: isInitialLoading,
    hasMore: query.data?.hasMore ?? false,
    totalCount: query.data?.totalCount ?? 0,
    fetchNextPage,
  };
}

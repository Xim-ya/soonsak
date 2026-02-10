/**
 * 시청 기록 React Query Hooks
 */

import { useQuery, useMutation, useQueryClient, UseQueryResult } from '@tanstack/react-query';
import { watchHistoryApi } from '../api/watchHistoryApi';
import type {
  WatchHistoryWithContentDto,
  WatchHistoryCalendarItemDto,
  CreateWatchHistoryParams,
} from '../types';

/** Query Key 팩토리 */
const watchHistoryKeys = {
  all: ['watchHistory'] as const,
  calendar: (year: number, month: number) => [...watchHistoryKeys.all, 'calendar', year, month] as const,
  list: () => [...watchHistoryKeys.all, 'list'] as const,
  uniqueList: () => [...watchHistoryKeys.all, 'uniqueList'] as const,
};

/**
 * 월별 캘린더 시청 기록 조회 Hook
 */
export const useWatchHistoryCalendar = (
  year: number,
  month: number,
  options?: {
    enabled?: boolean;
  },
): UseQueryResult<WatchHistoryCalendarItemDto[], Error> => {
  return useQuery({
    queryKey: watchHistoryKeys.calendar(year, month),
    queryFn: () => watchHistoryApi.getCalendarHistory(year, month),
    enabled: options?.enabled ?? true,
    staleTime: 5 * 60 * 1000, // 5분
    gcTime: 30 * 60 * 1000, // 30분
  });
};

/**
 * 시청 기록 목록 조회 Hook (페이지네이션)
 */
export const useWatchHistoryList = (
  limit: number = 20,
  offset: number = 0,
  options?: {
    enabled?: boolean;
  },
): UseQueryResult<{
  items: WatchHistoryWithContentDto[];
  hasMore: boolean;
  totalCount: number;
}, Error> => {
  return useQuery({
    queryKey: [...watchHistoryKeys.list(), limit, offset],
    queryFn: () => watchHistoryApi.getWatchHistoryList(limit, offset),
    enabled: options?.enabled ?? true,
    staleTime: 2 * 60 * 1000, // 2분
    gcTime: 10 * 60 * 1000, // 10분
  });
};

/**
 * 고유 콘텐츠 시청 기록 조회 Hook (중복 제거)
 */
export const useUniqueWatchHistory = (
  limit: number = 20,
  offset: number = 0,
  options?: {
    enabled?: boolean;
  },
): UseQueryResult<{
  items: WatchHistoryWithContentDto[];
  hasMore: boolean;
}, Error> => {
  return useQuery({
    queryKey: [...watchHistoryKeys.uniqueList(), limit, offset],
    queryFn: () => watchHistoryApi.getUniqueContentHistory(limit, offset),
    enabled: options?.enabled ?? true,
    staleTime: 2 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

/**
 * 시청 기록 추가 Mutation Hook
 */
export const useAddWatchHistory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: CreateWatchHistoryParams) => watchHistoryApi.addWatchHistory(params),
    onSuccess: () => {
      // 관련 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: watchHistoryKeys.all });
    },
    onError: (error) => {
      console.error('시청 기록 추가 실패:', error);
    },
  });
};

/**
 * 시청 기록 삭제 Mutation Hook
 */
export const useDeleteWatchHistory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (historyId: string) => watchHistoryApi.deleteWatchHistory(historyId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: watchHistoryKeys.all });
    },
    onError: (error) => {
      console.error('시청 기록 삭제 실패:', error);
    },
  });
};

/**
 * 전체 시청 기록 삭제 Mutation Hook
 */
export const useClearAllWatchHistory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => watchHistoryApi.clearAllWatchHistory(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: watchHistoryKeys.all });
    },
    onError: (error) => {
      console.error('전체 시청 기록 삭제 실패:', error);
    },
  });
};

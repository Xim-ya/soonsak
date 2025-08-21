/**
 * TMDB 영화 데이터를 가져오는 React Query Hook
 */

import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { MovieDto, TmdbApiError } from '../types';
import { tmdbApi } from '../api/tmdbApi';
import { ContentType } from '@/presentation/types/content/contentType.enum';

/**
 * 영화 상세 정보 조회 Hook
 * @param movieId 영화 ID
 * @param contentType 콘텐츠 타입 ('movie' | 'series' | 'unknown')
 * @param options React Query 옵션
 */
export const useMovieDetail = (
  movieId?: number,
  contentType: ContentType = 'movie',
  options?: {
    enabled?: boolean;
    staleTime?: number;
    gcTime?: number;
  },
): UseQueryResult<MovieDto, TmdbApiError> => {
  return useQuery({
    queryKey: ['tmdb', 'movie', movieId, contentType],
    queryFn: () => tmdbApi.getMovieDetails(movieId!),
    enabled: !!movieId && contentType === 'movie' && (options?.enabled ?? true),
    staleTime: options?.staleTime ?? 10 * 60 * 1000, // 10분 fresh
    gcTime: options?.gcTime ?? 30 * 60 * 1000, // 30분 캐시
    retry: (failureCount, error) => {
      if (error instanceof TmdbApiError) {
        return error.retry && failureCount < 2;
      }
      return failureCount < 1;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};

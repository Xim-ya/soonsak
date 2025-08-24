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
export const useDetailInfo = (
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
    queryFn: async () => {
      try {
        const response = await tmdbApi.getMovieDetails(movieId!);
        return response.data;
      } catch (error) {
        // 에러 로깅
        console.error('[useDetailInfo] 영화 상세 정보 조회 실패:', {
          movieId,
          contentType,
          error:
            error instanceof TmdbApiError
              ? {
                  message: error.message,
                  code: error.statusCode,
                  status: error.statusCode,
                }
              : error,
        });
        throw error; // React Query가 처리하도록 에러 재발생
      }
    },
    enabled: !!movieId && contentType === 'movie' && (options?.enabled ?? true),
    retry: false,
  });
};

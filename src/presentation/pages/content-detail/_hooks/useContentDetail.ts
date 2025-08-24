import { useQuery } from '@tanstack/react-query';
import { ContentDetailModel } from '../_types/contentDetailModel.cd';
import { ContentType } from '@/presentation/types/content/contentType.enum';
import { tmdbApi } from '@/features/tmdb/api/tmdbApi';
import { MovieDto } from '@/features/tmdb/types/movieDto';
import { TvSeriesDto } from '@/features/tmdb/types/tvDto';

/**
 * useContentDetail - 콘텐츠 상세 정보를 관리하는 훅
 *
 * TMDB API를 직접 호출하여 Movie/TV 데이터를 ContentDetailModel로 변환합니다.
 * React Query를 사용하여 캐싱과 중복 요청 방지를 자동으로 처리합니다.
 *
 * @param contentId - 콘텐츠 고유 ID (필수)
 * @param contentType - 콘텐츠 타입 ('movie' | 'tv') (필수)
 * @returns 콘텐츠 데이터, 로딩 상태, 에러 상태
 *
 * @example
 * // Movie 데이터 조회
 * const { data, isLoading, error } = useContentDetail(550, 'movie');
 *
 * // TV 시리즈 데이터 조회
 * const { data, isLoading, error } = useContentDetail(1396, 'tv');
 */
export function useContentDetail(contentId: number, contentType: ContentType) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['contentDetail', contentId, contentType],
    queryFn: async (): Promise<ContentDetailModel> => {
      try {
        let rawData: MovieDto | TvSeriesDto;

        if (contentType === 'movie') {
          const response = await tmdbApi.getMovieDetails(contentId);
          rawData = response.data;
        } else if (contentType === 'tv') {
          const response = await tmdbApi.getTvDetails(contentId);
          rawData = response.data;
        } else {
          throw new Error(`지원하지 않는 콘텐츠 타입: ${contentType}`);
        }

        // Movie/TV 데이터를 ContentDetailModel로 변환
        return ContentDetailModel.fromDto(rawData, contentType);
      } catch (error) {
        console.error('[useContentDetail] 콘텐츠 상세 정보 조회 실패:', {
          contentId,
          contentType,
          error,
        });
        throw error;
      }
    },
    enabled: contentType === 'movie' || contentType === 'tv',
    retry: false,
  });

  return {
    data: data || null,
    isLoading,
    error: error as Error | null,
  };
}


import { useQuery } from '@tanstack/react-query';
import { ContentType } from '@/presentation/types/content/contentType.enum';
import { tmdbApi } from '@/features/tmdb/api/tmdbApi';
import { contentApi } from '@/features/content/api/contentApi';
import { RelatedContentModel } from '../_types/relatedContentModel.cd';

/** 캐시 유지 시간 (5분) */
const STALE_TIME_MS = 1000 * 60 * 5;

/**
 * 콘텐츠 타입별 TMDB 추천 API 호출 함수 매핑
 */
const tmdbRecommendationApis = {
  movie: tmdbApi.getMovieRecommendations,
  tv: tmdbApi.getTvRecommendations,
} as const;

/**
 * 지원되는 콘텐츠 타입인지 확인하는 타입 가드
 */
function isSupportedContentType(type: ContentType): type is 'movie' | 'tv' {
  return type === 'movie' || type === 'tv';
}

/**
 * TMDB에서 추천 콘텐츠 ID 목록을 조회
 */
async function fetchTmdbRecommendationIds(
  contentId: number,
  contentType: 'movie' | 'tv',
): Promise<number[]> {
  const apiCall = tmdbRecommendationApis[contentType];
  const response = await apiCall(contentId);
  return response.data.results.map((item) => item.id);
}

/**
 * useRelatedContents - 관련 콘텐츠를 조회하는 훅
 *
 * TMDB API에서 추천/유사 콘텐츠를 조회한 후,
 * Supabase에 등록된 콘텐츠만 필터링하여 반환합니다.
 *
 * @param contentId - 콘텐츠 고유 ID (필수)
 * @param contentType - 콘텐츠 타입 ('movie' | 'tv') (필수)
 * @returns 관련 콘텐츠 목록, 로딩 상태, 에러 상태
 *
 * @example
 * const { data, isLoading, error } = useRelatedContents(550, 'movie');
 */
export function useRelatedContents(
  contentId: number,
  contentType: ContentType,
): {
  data: RelatedContentModel[];
  isLoading: boolean;
  error: Error | null;
} {
  const isSupported = isSupportedContentType(contentType);

  const { data, isLoading, error } = useQuery({
    queryKey: ['relatedContents', contentId, contentType],
    queryFn: async (): Promise<RelatedContentModel[]> => {
      // 타입 가드 통과 후 안전하게 사용
      if (!isSupportedContentType(contentType)) {
        return [];
      }

      // 1. TMDB에서 추천 콘텐츠 ID 조회
      const tmdbIds = await fetchTmdbRecommendationIds(contentId, contentType);

      // 추천 콘텐츠가 없으면 빈 배열 반환
      if (tmdbIds.length === 0) {
        return [];
      }

      // 2. Supabase에서 등록된 콘텐츠만 필터링
      const contentDtos = await contentApi.getRegisteredContentsByTmdbIds(tmdbIds, contentType);

      // 3. DTO를 Model로 변환
      return RelatedContentModel.fromDtoList(contentDtos);
    },
    enabled: isSupported,
    retry: false,
    staleTime: STALE_TIME_MS,
  });

  return {
    data: data ?? [],
    isLoading,
    error: error as Error | null,
  };
}

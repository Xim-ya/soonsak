/**
 * TMDB Feature Module
 *
 * The Movie Database (TMDB) API 통합 모듈
 * 영화 상세 정보 조회를 제공합니다.
 *
 * @example
 * // Hook 사용 (권장)
 * import { useTmdbMovie } from '@/features/tmdb';
 * const { data: movie, isLoading } = useTmdbMovie(550);
 *
 * // API 직접 사용
 * import { tmdbApi } from '@/features/tmdb';
 * const movie = await tmdbApi.getMovieDetails(550);
 */

// API exports
export { tmdbApi } from './api/tmdbApi';

// React Query Hook exports
export { useTmdbMovie } from './hooks';

// 타입들 exports
export type {
  GenreDto,
  ProductionCompanyDto,
  ProductionCountryDto,
  SpokenLanguageDto,
  TmdbErrorDto,
  TmdbApiResponse,
  TmdbApiError,
} from './types/common';

export type { MovieDto, CollectionDto } from './types/movieDto';
export type { TvSeriesDto, CreatorDto, NetworkDto, EpisodeDto, SeasonDto } from './types/tvDto';

// 설정 상수들 exports
export {
  TMDB_BASE_URL,
  TMDB_IMAGE_BASE_URL,
  SUPPORTED_LANGUAGES,
  DEFAULT_LANGUAGE,
} from './config';

export type { SupportedLanguage } from './config';

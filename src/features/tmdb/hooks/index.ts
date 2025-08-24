/**
 * TMDB React Query Hook
 *
 * TMDB 영화 상세 정보 조회를 위한 커스텀 훅을 제공합니다.
 *
 * @example
 * // 영화 상세 정보 조회 (기본: 영화 타입)
 * const { data: movie, isLoading } = useTmdbMovie(550);
 *
 * // 콘텐츠 타입 지정
 * const { data: movie, isLoading } = useTmdbMovie(550, 'movie');
 */

export { useContentDetail as useTmdbMovie } from './useContentDetail';

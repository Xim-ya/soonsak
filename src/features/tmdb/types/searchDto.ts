/**
 * TMDB Search API 타입 정의
 * 멀티 검색 (영화 + TV) 관련 DTO
 */

/**
 * 멀티 검색 결과 개별 아이템 DTO
 * movie, tv, person 타입을 모두 포함
 */
export interface SearchMultiResultDto {
  readonly id: number;
  readonly mediaType: 'movie' | 'tv' | 'person';
  readonly posterPath: string | null;
  readonly title?: string; // movie
  readonly name?: string; // tv, person
  readonly releaseDate?: string; // movie
  readonly firstAirDate?: string; // tv
  readonly overview?: string;
  readonly voteAverage?: number;
  readonly popularity?: number;
}

/**
 * 멀티 검색 API 응답 DTO
 */
export interface SearchMultiResponseDto {
  readonly page: number;
  readonly results: SearchMultiResultDto[];
  readonly totalPages: number;
  readonly totalResults: number;
}

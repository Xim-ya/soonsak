/**
 * TMDB API 타입 정의
 * interceptor에서 snake_case를 camelCase로 자동 변환하므로
 * 인터페이스는 camelCase로 정의
 */

/**
 * TMDB API 에러 클래스
 */
export class TmdbApiError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public retry: boolean = true,
  ) {
    super(message);
    this.name = 'TmdbApiError';
  }
}

/**
 * 장르 정보 DTO
 */
export interface GenreDto {
  readonly id: number;
  readonly name: string;
}

/**
 * 제작사 정보 DTO
 */
export interface ProductionCompanyDto {
  readonly id: number;
  readonly logoPath: string | null;
  readonly name: string;
  readonly originCountry: string;
}

/**
 * 제작 국가 정보 DTO
 */
export interface ProductionCountryDto {
  readonly iso31661: string;
  readonly name: string;
}

/**
 * 사용 언어 정보 DTO
 */
export interface SpokenLanguageDto {
  readonly englishName: string;
  readonly iso6391: string;
  readonly name: string;
}

/**
 * 컬렉션 정보 DTO (belongsToCollection)
 */
export interface CollectionDto {
  readonly id: number;
  readonly name: string;
  readonly posterPath: string | null;
  readonly backdropPath: string | null;
}

/**
 * TMDB 영화 상세 정보 DTO
 * axios interceptor에서 snake_case를 camelCase로 자동 변환
 */
export interface MovieDto {
  readonly adult: boolean;
  readonly backdropPath: string | null;
  readonly belongsToCollection: CollectionDto | null;
  readonly budget: number;
  readonly genres: GenreDto[];
  readonly homepage: string;
  readonly id: number;
  readonly imdbId: string;
  readonly originCountry: string[];
  readonly originalLanguage: string;
  readonly originalTitle: string;
  readonly overview: string;
  readonly popularity: number;
  readonly posterPath: string | null;
  readonly productionCompanies: ProductionCompanyDto[];
  readonly productionCountries: ProductionCountryDto[];
  readonly releaseDate: string;
  readonly revenue: number;
  readonly runtime: number;
  readonly spokenLanguages: SpokenLanguageDto[];
  readonly status: string;
  readonly tagline: string;
  readonly title: string;
  readonly video: boolean;
  readonly voteAverage: number;
  readonly voteCount: number;
}

/**
 * TMDB API 에러 응답 DTO
 */
export interface TmdbErrorDto {
  readonly success: boolean;
  readonly statusCode: number;
  readonly statusMessage: string;
}

/**
 * TMDB API 공통 응답 타입
 */
export type TmdbApiResponse<T> = T | TmdbErrorDto;

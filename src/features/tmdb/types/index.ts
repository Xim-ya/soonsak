/**
 * TMDB API 타입 정의
 * TMDB Movie Details API 응답과 1대1 대응
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
  readonly logo_path: string | null;
  readonly name: string;
  readonly origin_country: string;
}

/**
 * 제작 국가 정보 DTO
 */
export interface ProductionCountryDto {
  readonly iso_3166_1: string;
  readonly name: string;
}

/**
 * 사용 언어 정보 DTO
 */
export interface SpokenLanguageDto {
  readonly english_name: string;
  readonly iso_639_1: string;
  readonly name: string;
}

/**
 * 컬렉션 정보 DTO (belongs_to_collection)
 */
export interface CollectionDto {
  readonly id: number;
  readonly name: string;
  readonly poster_path: string | null;
  readonly backdrop_path: string | null;
}

/**
 * TMDB 영화 상세 정보 DTO
 * TMDB Movie Details API 공식 응답과 완전 대응
 */
export interface MovieDto {
  readonly adult: boolean;
  readonly backdrop_path: string | null;
  readonly belongs_to_collection: CollectionDto | null;
  readonly budget: number;
  readonly genres: GenreDto[];
  readonly homepage: string;
  readonly id: number;
  readonly imdb_id: string;
  readonly origin_country: string[];
  readonly original_language: string;
  readonly original_title: string;
  readonly overview: string;
  readonly popularity: number;
  readonly poster_path: string | null;
  readonly production_companies: ProductionCompanyDto[];
  readonly production_countries: ProductionCountryDto[];
  readonly release_date: string;
  readonly revenue: number;
  readonly runtime: number;
  readonly spoken_languages: SpokenLanguageDto[];
  readonly status: string;
  readonly tagline: string;
  readonly title: string;
  readonly video: boolean;
  readonly vote_average: number;
  readonly vote_count: number;
}

/**
 * TMDB API 에러 응답 DTO
 */
export interface TmdbErrorDto {
  readonly success: boolean;
  readonly status_code: number;
  readonly status_message: string;
}

/**
 * TMDB API 공통 응답 타입
 */
export type TmdbApiResponse<T> = T | TmdbErrorDto;

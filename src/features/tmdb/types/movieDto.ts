/**
 * TMDB Movie API 타입 정의
 * 영화 특화 DTO들
 */

import { GenreDto, ProductionCompanyDto, ProductionCountryDto, SpokenLanguageDto } from './common';

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

/**
 * TMDB TV Series API 타입 정의
 * TV 시리즈 특화 DTO들
 */

import { GenreDto, ProductionCompanyDto, ProductionCountryDto, SpokenLanguageDto } from './common';

/**
 * TV 시리즈 제작자 정보
 */
export interface CreatorDto {
  readonly id: number;
  readonly creditId: string;
  readonly name: string;
  readonly originalName: string;
  readonly gender: number;
  readonly profilePath: string | null;
}

/**
 * 네트워크 정보
 */
export interface NetworkDto {
  readonly id: number;
  readonly logoPath: string | null;
  readonly name: string;
  readonly originCountry: string;
}

/**
 * 에피소드 정보
 */
export interface EpisodeDto {
  readonly id: number;
  readonly name: string;
  readonly overview: string;
  readonly voteAverage: number;
  readonly voteCount: number;
  readonly airDate: string;
  readonly episodeNumber: number;
  readonly episodeType?: string;
  readonly productionCode: string;
  readonly runtime: number | null;
  readonly seasonNumber: number;
  readonly showId: number;
  readonly stillPath: string | null;
}

/**
 * 시즌 정보
 */
export interface SeasonDto {
  readonly airDate: string | null;
  readonly episodeCount: number;
  readonly id: number;
  readonly name: string;
  readonly overview: string;
  readonly posterPath: string | null;
  readonly seasonNumber: number;
  readonly voteAverage: number;
}

/**
 * TMDB TV 시리즈 상세 정보 DTO
 */
export interface TvSeriesDto {
  readonly adult: boolean;
  readonly backdropPath: string | null;
  readonly createdBy: CreatorDto[];
  readonly episodeRunTime: number[];
  readonly firstAirDate: string;
  readonly genres: GenreDto[];
  readonly homepage: string;
  readonly id: number;
  readonly inProduction: boolean;
  readonly languages: string[];
  readonly lastAirDate: string;
  readonly lastEpisodeToAir: EpisodeDto | null;
  readonly name: string;
  readonly nextEpisodeToAir: EpisodeDto | null;
  readonly networks: NetworkDto[];
  readonly numberOfEpisodes: number;
  readonly numberOfSeasons: number;
  readonly originCountry: string[];
  readonly originalLanguage: string;
  readonly originalName: string;
  readonly overview: string;
  readonly popularity: number;
  readonly posterPath: string | null;
  readonly productionCompanies: ProductionCompanyDto[];
  readonly productionCountries: ProductionCountryDto[];
  readonly seasons: SeasonDto[];
  readonly spokenLanguages: SpokenLanguageDto[];
  readonly status: string;
  readonly tagline: string;
  readonly type: string;
  readonly voteAverage: number;
  readonly voteCount: number;
}

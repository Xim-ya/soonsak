/**
 * TMDB Watch Providers API 응답 타입 정의
 * Movie/TV Watch Providers에서 공통으로 사용되는 타입들
 *
 * tmdbClient interceptor가 snake_case→camelCase 자동 변환하므로 camelCase로 정의
 */

export interface WatchProviderDto {
  readonly providerId: number;
  readonly providerName: string;
  readonly logoPath: string;
  readonly displayPriority: number;
}

export interface WatchProviderCountryDto {
  readonly flatrate?: WatchProviderDto[];
  readonly rent?: WatchProviderDto[];
  readonly buy?: WatchProviderDto[];
  readonly link?: string;
}

export interface WatchProvidersResponseDto {
  readonly id: number;
  readonly results: Record<string, WatchProviderCountryDto>;
}

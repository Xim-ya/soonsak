import { WatchProvidersResponseDto } from './watchProviderDto';

/**
 * WatchProviderModel - 스트리밍 공급처 정보
 *
 * KR 지역의 OTT 서비스를 추출 (flatrate → rent → buy 우선순위, 중복 제거)
 */
export interface WatchProviderModel {
  readonly providerId: number;
  readonly providerName: string;
  readonly logoPath: string;
  readonly displayPriority: number;
}

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace WatchProviderModel {
  const COUNTRY_CODE = 'KR';

  /**
   * TMDB Watch Providers 응답에서 WatchProviderModel[] 변환
   * KR 지역의 flatrate → rent → buy 순으로 병합하고 중복 제거
   */
  export function fromDto(response: WatchProvidersResponseDto): WatchProviderModel[] {
    const krData = response.results[COUNTRY_CODE];
    if (!krData) return [];

    const allProviders = [
      ...(krData.flatrate ?? []),
      ...(krData.rent ?? []),
      ...(krData.buy ?? []),
    ];

    // providerId 기준 중복 제거 (먼저 나온 것 우선 = flatrate > rent > buy)
    const seen = new Set<number>();
    const unique = allProviders.filter((p) => {
      if (seen.has(p.providerId)) return false;
      seen.add(p.providerId);
      return true;
    });

    return unique
      .map((provider) => ({
        providerId: provider.providerId,
        providerName: provider.providerName,
        logoPath: provider.logoPath,
        displayPriority: provider.displayPriority,
      }))
      .sort((a, b) => a.displayPriority - b.displayPriority);
  }
}

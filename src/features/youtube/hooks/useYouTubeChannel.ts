/**
 * YouTube 채널 데이터를 가져오는 React Query Hook
 */

import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { YouTubeChannelDto, YouTubeApiError } from '../types';
import { channelScraper } from '../api/scrapers/channelScraper';

/**
 * YouTube 채널 정보 조회 Hook
 *
 * @param channelId - 채널 ID 또는 핸들 (@01nam, @channelname 등)
 * @param options - React Query 옵션
 * @returns 채널 정보, 로딩 상태, 에러 상태
 *
 * @example
 * // 채널 핸들로 조회
 * const { data: channel, isLoading, error } = useYouTubeChannel('@01nam');
 *
 * // 채널 ID로 조회
 * const { data: channel } = useYouTubeChannel('UC1234567890');
 */
export const useYouTubeChannel = (
  channelId?: string,
  options?: {
    enabled?: boolean;
    staleTime?: number;
    gcTime?: number;
  },
): UseQueryResult<YouTubeChannelDto, YouTubeApiError> => {
  return useQuery({
    queryKey: ['youtube', 'channel', channelId],
    queryFn: async (): Promise<YouTubeChannelDto> => {
      try {
        console.log('🔍 채널 정보 조회 시작:', channelId);

        // 채널 ID 정규화 (@이 없으면 추가)
        const normalizedChannelId = channelId!.startsWith('@') ? channelId! : `@${channelId!}`;

        // 채널 페이지 스크래핑
        const scrapedData = await channelScraper.scrapeChannelPage(normalizedChannelId);

        // ScrapedChannelDto를 YouTubeChannelDto로 변환
        const channelData: YouTubeChannelDto = {
          id: normalizedChannelId,
          name: scrapedData.name,
          description: scrapedData.description,
          subscriberCount: scrapedData.subscriberCount,
          ...(scrapedData.subscriberText && { subscriberText: scrapedData.subscriberText }),
          images: {
            avatar: scrapedData.avatarUrl,
            ...(scrapedData.bannerUrl && { banner: scrapedData.bannerUrl }),
          },
          metadata: {
            ...(scrapedData.videoCount && { videoCount: scrapedData.videoCount }),
          },
        };

        console.log('✅ 채널 정보 조회 완료:', channelData.name);
        return channelData;
      } catch (error) {
        console.error('❌ 채널 정보 조회 실패:', error);
        throw error;
      }
    },
    enabled: !!channelId && (options?.enabled ?? true),
    staleTime: options?.staleTime ?? 10 * 60 * 1000, // 10분 fresh (채널 정보는 자주 변하지 않음)
    gcTime: options?.gcTime ?? 30 * 60 * 1000, // 30분 캐시
    retry: (failureCount, error) => {
      // YouTube API 에러에 따른 재시도 로직
      if (error instanceof YouTubeApiError) {
        return error.retry && failureCount < 2;
      }
      return failureCount < 1;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};

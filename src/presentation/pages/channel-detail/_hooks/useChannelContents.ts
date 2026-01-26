import { useInfiniteQuery, InfiniteData } from '@tanstack/react-query';
import { contentApi } from '@/features/content/api/contentApi';
import { VideoWithContentDto } from '@/features/content/types';
import { ChannelVideoModel } from '../_types';

interface ChannelContentsResponse {
  videos: VideoWithContentDto[];
  hasMore: boolean;
  totalCount: number;
}

interface UseChannelContentsReturn {
  videos: ChannelVideoModel[];
  isLoading: boolean;
  error: Error | null;
  fetchNextPage: () => void;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  totalCount: number;
}

export function useChannelContents(channelId: string): UseChannelContentsReturn {
  const { data, isLoading, error, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery<
      ChannelContentsResponse,
      Error,
      InfiniteData<ChannelContentsResponse>,
      string[],
      number
    >({
      queryKey: ['channelVideos', channelId],
      queryFn: async ({ pageParam = 0 }) => {
        return contentApi.getDistinctContentsByChannel(channelId, pageParam, 20);
      },
      initialPageParam: 0,
      getNextPageParam: (lastPage, pages) => {
        return lastPage.hasMore ? pages.length : undefined;
      },
      enabled: !!channelId,
      staleTime: 5 * 60 * 1000,
    });

  const videos = data?.pages.flatMap((page) => ChannelVideoModel.fromDtoList(page.videos)) ?? [];
  // 첫 번째 페이지에서 전체 콘텐츠 수를 가져옴
  const totalCount = data?.pages[0]?.totalCount ?? 0;

  return {
    videos,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    totalCount,
  };
}

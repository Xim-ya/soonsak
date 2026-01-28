import { createContext, useContext, useState, useEffect, useMemo, useRef, ReactNode } from 'react';
import { VideoDto } from '@/features/content/types';
import { contentApi } from '@/features/content/api/contentApi';
import { ContentType } from '@/presentation/types/content/contentType.enum';
import { usePrefetchCommentToken } from '@/features/youtube';

interface ContentDetailContextType {
  videos: VideoDto[];
  primaryVideo: VideoDto | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
  /** 댓글 토큰 (prefetch됨) */
  commentToken: string | null;
  /** 총 댓글 수 텍스트 */
  commentTotalCountText: string | undefined;
  /** 댓글 토큰 로딩 중 여부 */
  isCommentTokenLoading: boolean;
}

const ContentDetailContext = createContext<ContentDetailContextType | undefined>(undefined);

interface ContentDetailProviderProps {
  children: ReactNode;
  contentId: number;
  contentType: ContentType;
  videoId?: string | undefined; // 특정 비디오 ID (채널 상세에서 전달받은 경우)
}

/**
 * ContentDetailProvider - 콘텐츠 상세 화면에서 비디오 데이터를 관리하는 프로바이더
 *
 * contentId와 contentType을 기반으로 videos 테이블에서 관련 영상 정보를 조회하고 관리합니다.
 *
 * @example
 * <ContentDetailProvider contentId={123} contentType={ContentType.MOVIE}>
 *   <ContentDetailScreen />
 * </ContentDetailProvider>
 */
export function ContentDetailProvider({
  children,
  contentId,
  contentType,
  videoId,
}: ContentDetailProviderProps) {
  const [videos, setVideos] = useState<VideoDto[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchVideos = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const videosData = await contentApi.getVideosByContent(contentId, contentType);
      setVideos(videosData);
    } catch (err) {
      setError(err instanceof Error ? err.message : '비디오 조회 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const refetch = () => {
    fetchVideos();
  };

  useEffect(() => {
    fetchVideos();
  }, [contentId, contentType]);

  // 조회수 증가 (페이지 진입 시 1회만 실행)
  const hasIncrementedViewCount = useRef(false);
  useEffect(() => {
    if (!hasIncrementedViewCount.current) {
      hasIncrementedViewCount.current = true;
      contentApi.incrementViewCount(contentId, contentType);
    }
  }, [contentId, contentType]);

  // 대표 비디오 선택 로직
  // 1순위: videoId가 전달된 경우 해당 비디오 사용 (채널 상세에서 특정 비디오 선택 시)
  // 2순위: isPrimary가 true인 비디오
  // 3순위(폴백): 모든 비디오가 isPrimary=false인 경우 첫 번째 비디오 사용
  const primaryVideo: VideoDto | null = useMemo(() => {
    if (videos.length === 0) return null;

    // videoId가 전달된 경우 해당 비디오를 우선 선택
    if (videoId) {
      const targetVideo = videos.find((video) => video.id === videoId);
      if (targetVideo) return targetVideo;
    }

    // videoId가 없거나 찾지 못한 경우 기존 로직 적용
    return videos.find((video) => video.isPrimary) ?? videos[0] ?? null;
  }, [videos, videoId]);

  // 댓글 토큰 prefetch (페이지 진입 시 미리 조회)
  const {
    token: commentToken,
    totalCountText: commentTotalCountText,
    isLoading: isCommentTokenLoading,
  } = usePrefetchCommentToken(primaryVideo?.id);

  const contextValue: ContentDetailContextType = {
    videos,
    primaryVideo,
    isLoading,
    error,
    refetch,
    commentToken,
    commentTotalCountText,
    isCommentTokenLoading,
  };

  return (
    <ContentDetailContext.Provider value={contextValue}>{children}</ContentDetailContext.Provider>
  );
}

export function useContentVideos(): ContentDetailContextType {
  const context = useContext(ContentDetailContext);
  if (context === undefined) {
    throw new Error('useContentVideos must be used within a ContentDetailProvider');
  }
  return context;
}

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { VideoDto } from '@/features/content/types';
import { contentApi } from '@/features/content/api/contentApi';
import { ContentType } from '@/presentation/types/content/contentType.enum';

interface ContentDetailContextType {
  videos: VideoDto[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

const ContentDetailContext = createContext<ContentDetailContextType | undefined>(undefined);

interface ContentDetailProviderProps {
  children: ReactNode;
  contentId: number;
  contentType: ContentType;
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
  contentType 
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

  const contextValue: ContentDetailContextType = {
    videos,
    isLoading,
    error,
    refetch,
  };

  return (
    <ContentDetailContext.Provider value={contextValue}>
      {children}
    </ContentDetailContext.Provider>
  );
}

export function useContentVideos(): ContentDetailContextType {
  const context = useContext(ContentDetailContext);
  if (context === undefined) {
    throw new Error('useContentVideos must be used within a ContentDetailProvider');
  }
  return context;
}
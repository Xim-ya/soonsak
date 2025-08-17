import { useState, useEffect } from 'react';
import styled from '@emotion/native';
import textStyles from '@/shared/styles/textStyles';
import colors from '@/shared/styles/colors';
import { formatter } from '@/shared/utils/formatter';
import EyeSvg from '@assets/icons/eye.svg';
import ThumbSvg from '@assets/icons/thumb.svg';
import SmallDateSvg from '@assets/icons/small_date.svg';
import Gap from '@/presentation/components/view/Gap';
import {
  getYouTubeVideoMetadata,
  YouTubeVideoMetadata,
} from '@/utils/youtube/ytClient';
import { useQuery } from '@tanstack/react-query';

// Props 타입 정의
interface VideoMetricsViewProps {
  youtubeUrl?: string;
  videoId?: string;
}

export const VideoMetricsView = ({
  youtubeUrl,
  videoId,
}: VideoMetricsViewProps = {}) => {
  // 기본 YouTube URL (사용자가 제공한 URL)
  const defaultYouTubeUrl = 'https://www.youtube.com/watch?v=KfbFaQJK7Sc';
  const targetUrl = youtubeUrl || videoId || defaultYouTubeUrl;

  // 🚀 React Query로 메인 스레드 블락 방지
  const {
    data: videoInfo,
    isLoading: loading,
    error,
    isError,
  } = useQuery({
    queryKey: ['youtubeMetadata', targetUrl],
    queryFn: async (): Promise<YouTubeVideoMetadata> => {
      console.log('🎯 oEmbed API로 YouTube 메타데이터 가져오기 시작');
      return await getYouTubeVideoMetadata(targetUrl);
    },
    staleTime: 5 * 60 * 1000, // 5분간 fresh
    gcTime: 15 * 60 * 1000, // 15분간 캐시 유지
    retry: 1,
    // 🚀 에러 시 Mock 데이터 반환
    retryOnMount: false,
    refetchOnWindowFocus: false,
  });

  // 🚀 에러 시 Mock 데이터 제공
  const displayData = isError
    ? {
        viewCount: 1234567,
        likesCount: 89123,
        uploadDate: '2024-01-15T10:30:00Z',
        title: 'Sample Video',
        description: 'Sample Description',
        channelName: 'Sample Channel',
        duration: '10:30',
      }
    : videoInfo;

  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case 'eye':
        return <EyeSvg />;
      case 'thumb':
        return <ThumbSvg />;
      case 'small_date':
        return <SmallDateSvg />;
      default:
        return null;
    }
  };

  const renderColumnItem = (title: string, iconName: string, data: string | null) => {
    return (
      <ColumnContainer>
        <StackContainer>
          <TopSection>
            {renderIcon(iconName)}
            <TitleText>{title}</TitleText>
          </TopSection>
          <Gap size={4} />
          <DataText>{loading ? '로딩중...' : (data ?? '정보없음')}</DataText>
        </StackContainer>
      </ColumnContainer>
    );
  };

  return (
    <Container>
      {isError && (
        <ErrorContainer>
          <ErrorText>YouTube 데이터를 불러올 수 없습니다. (Mock 데이터 표시)</ErrorText>
        </ErrorContainer>
      )}

      {renderColumnItem(
        '조회수',
        'eye',
        displayData ? formatter.formatNumberWithUnit(displayData.viewCount, true) : null,
      )}
      {renderColumnItem(
        '좋아요',
        'thumb',
        displayData
          ? displayData.likesCount > 0
            ? formatter.formatNumberWithUnit(displayData.likesCount, false)
            : displayData.likesText || '비공개'
          : null,
      )}
      {renderColumnItem(
        '업로드일',
        'small_date',
        displayData
          ? displayData.uploadDate !== new Date().toISOString().split('T')[0]
            ? formatter.getDateDifferenceFromNow(displayData.uploadDate)
            : '오늘'
          : null,
      )}
    </Container>
  );
};

/* Styled Components */
const Container = styled.View({
  height: 118,
  flexDirection: 'row',
  justifyContent: 'space-around',
  alignItems: 'center',
});

const ColumnContainer = styled.View({
  height: 54,
  alignItems: 'center',
  justifyContent: 'center',
});

const StackContainer = styled.View({
  alignItems: 'center',
  justifyContent: 'space-between',
  height: '100%',
});

const TopSection = styled.View({
  alignItems: 'center',
  justifyContent: 'center',
  flex: 1,
});

const TitleText = styled.Text({
  ...textStyles.nav,
  color: colors.gray02,
});

const DataText = styled.Text({
  ...textStyles.title3,
  color: colors.white,
  textAlign: 'center',
});

const ErrorContainer = styled.View({
  position: 'absolute',
  top: -20,
  left: 0,
  right: 0,
  zIndex: 1,
});

const ErrorText = styled.Text({
  ...textStyles.nav,
  color: colors.red,
  textAlign: 'center',
});

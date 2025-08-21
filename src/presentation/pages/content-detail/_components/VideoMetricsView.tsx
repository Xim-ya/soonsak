import styled from '@emotion/native';
import textStyles from '@/shared/styles/textStyles';
import colors from '@/shared/styles/colors';
import { formatter } from '@/shared/utils/formatter';
import EyeSvg from '@assets/icons/eye.svg';
import ThumbSvg from '@assets/icons/thumb.svg';
import SmallDateSvg from '@assets/icons/small_date.svg';
import Gap from '@/presentation/components/view/Gap';
import { useYouTubeVideo } from '@/features/youtube';

// Props 타입 정의
interface VideoMetricsViewProps {
  youtubeUrl?: string;
  videoId?: string;
}

export const VideoMetricsView = ({ youtubeUrl, videoId }: VideoMetricsViewProps = {}) => {
  // 기본 YouTube URL (사용자가 제공한 URL)
  const defaultYouTubeUrl = 'https://www.youtube.com/watch?v=U5TPQoEveJY';
  const targetUrl = youtubeUrl || videoId || defaultYouTubeUrl;

  // 새로운 YouTube Hook 사용
  const { data: videoInfo, isLoading: loading } = useYouTubeVideo(targetUrl);

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
          <DataText>{loading ? '-' : (data ?? '-')}</DataText>
        </StackContainer>
      </ColumnContainer>
    );
  };

  return (
    <Container>
      {renderColumnItem(
        '조회수',
        'eye',
        videoInfo?.metrics
          ? formatter.formatNumberWithUnit(videoInfo.metrics.viewCount, true)
          : null,
      )}
      {renderColumnItem(
        '좋아요',
        'thumb',
        videoInfo?.metrics
          ? videoInfo.metrics.likeCount > 0
            ? formatter.formatNumberWithUnit(videoInfo.metrics.likeCount, false)
            : videoInfo.metrics.likeText || '비공개'
          : null,
      )}
      {renderColumnItem(
        '업로드일',
        'small_date',
        videoInfo?.metadata
          ? videoInfo.metadata.uploadDate !== new Date().toISOString().split('T')[0]
            ? formatter.getDateDifferenceFromNow(videoInfo.metadata.uploadDate)
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

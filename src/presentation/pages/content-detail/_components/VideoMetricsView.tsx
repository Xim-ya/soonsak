import { useState, useEffect } from 'react';
import styled from '@emotion/native';
import textStyles from '@/shared/styles/textStyles';
import colors from '@/shared/styles/colors';
import { formatter } from '@/shared/utils/formatter';
import EyeSvg from '@assets/icons/eye.svg';
import ThumbSvg from '@assets/icons/thumb.svg';
import SmallDateSvg from '@assets/icons/small_date.svg';
import Gap from '@/presentation/components/view/Gap';

// Mock 데이터 타입 정의
interface VideoInfo {
  viewCount: number;
  likesCount: number;
  uploadDate: string;
}

// Mock 데이터
const mockVideoInfo: VideoInfo = {
  viewCount: 1234567,
  likesCount: 89123,
  uploadDate: '2024-01-15T10:30:00Z',
};

export const VideoMetricsView = () => {
  const [videoInfo, setVideoInfo] = useState<VideoInfo | null>(null);

  // 컴포넌트 마운트 시 Mock 데이터 로드
  useEffect(() => {
    // 실제 앱에서는 API 호출이나 props로 데이터를 받아올 예정
    setVideoInfo(mockVideoInfo);
  }, []);

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
          <DataText>{data ?? '-'}</DataText>
        </StackContainer>
      </ColumnContainer>
    );
  };

  return (
    <Container>
      {renderColumnItem(
        '조회수',
        'eye',
        videoInfo ? formatter.formatNumberWithUnit(videoInfo.viewCount, true) : null,
      )}
      {renderColumnItem(
        '좋아요',
        'thumb',
        videoInfo ? formatter.formatNumberWithUnit(videoInfo.likesCount, false) : null,
      )}
      {renderColumnItem(
        '업로드일',
        'small_date',
        videoInfo ? formatter.getDateDifferenceFromNow(videoInfo.uploadDate) : null,
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

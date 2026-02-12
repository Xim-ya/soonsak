import React from 'react';
import styled from '@emotion/native';
import ContentTypeChip from '@/presentation/components/chip/ContentTypeChip';
import DarkChip from '@/presentation/components/chip/DarkChip';
import { videoTagConfigs } from '@/presentation/types/content/videoTag.enum';
import Gap from '@/presentation/components/view/Gap';
import colors from '@/shared/styles/colors';
import textStyles from '@/shared/styles/textStyles';
import { StartRateView } from '../StartRateView';
import { useContentDetail } from '../../_hooks/useContentDetail';
import { useContentVideos } from '../../_provider/ContentDetailProvider';
import { SkeletonView } from '@/presentation/components/loading/SkeletonView';
import { formatter } from '@/shared/utils/formatter';
import { useContentDetailRoute } from '../../_hooks/useContentDetailRoute';

/**
 * 콘텐츠 기본 정보 표시 컴포넌트
 *
 * 책임:
 * - 콘텐츠 타입 칩
 * - 콘텐츠 제목, 개봉년도, 장르 리스트
 * - 비디오 타이틀
 * - 별점 표시
 */
export const ContentInfo = React.memo(() => {
  const { id, title, type } = useContentDetailRoute();
  const {
    data: contentInfo,
    isLoading: isContentInfoLoading,
    error: contentInfoError,
  } = useContentDetail(Number(id), type);

  const { primaryVideo, isLoading: isVideosLoading } = useContentVideos();

  // 연도 추출
  const releaseYear = contentInfo?.releaseDate ? formatter.dateToYear(contentInfo.releaseDate) : '';

  // 평점 계산 (10점 만점 -> 5점 만점)
  const rating = contentInfo?.voteAverage ? contentInfo.voteAverage / 2 : 0;

  // 장르 존재 여부
  const hasGenres = contentInfo?.genres && contentInfo.genres.length > 0;

  // 결말 포함 칩 표시 여부
  const showEndingChip = primaryVideo?.includesEnding;

  return (
    <Container>
      {/* 콘텐츠 타입 및 결말 포함 칩 */}
      <ChipRow>
        <ContentTypeChip contentType={type} />
        {showEndingChip && (
          <>
            <Gap size={6} />
            <DarkChip content={videoTagConfigs.includesEnding.label} />
          </>
        )}
      </ChipRow>
      <Gap size={4} />

      {/* 제목 - route params에서 바로 표시 */}
      <Title>{title}</Title>
      <Gap size={2} />

      {/* 연도/장르 - 로딩 중이면 스켈레톤 */}
      {isContentInfoLoading ? (
        <SubTextView>
          <SkeletonView width={200} height={16} borderRadius={4} />
        </SubTextView>
      ) : contentInfoError ? null : (
        <SubTextView>
          {releaseYear && <SubText>{releaseYear}</SubText>}
          {hasGenres && (
            <>
              {releaseYear && <DotText> · </DotText>}
              {contentInfo!.genres.map((genre, index) => (
                <React.Fragment key={genre.id}>
                  <SubText>{genre.name}</SubText>
                  {index < contentInfo!.genres.length - 1 && <SubText> · </SubText>}
                </React.Fragment>
              ))}
            </>
          )}
        </SubTextView>
      )}
      <Gap size={10} />

      {/* 비디오 타이틀 */}
      {isVideosLoading ? (
        <SkeletonView width={250} height={20} borderRadius={4} />
      ) : (
        <ContentTitle numberOfLines={1}>
          {primaryVideo?.title || '비디오를 불러오는 중...'}
        </ContentTitle>
      )}
      <Gap size={8} />

      {/* 별점 */}
      <RatingWrapper>
        <StartRateView rating={rating} />
      </RatingWrapper>
    </Container>
  );
});

ContentInfo.displayName = 'ContentInfo';

/* Styled Components - ContentInfo 전용 */
const Container = styled.View({
  justifyContent: 'center',
  alignItems: 'center',
  paddingVertical: 20,
  paddingHorizontal: 16,
  pointerEvents: 'box-none' as const,
});

const ChipRow = styled.View({
  flexDirection: 'row',
  alignItems: 'center',
});

const Title = styled.Text({
  ...textStyles.headline1,
});

const ContentTitle = styled.Text({
  ...textStyles.body3,
});

const SubTextView = styled.View({
  flexDirection: 'row',
  alignItems: 'center',
});

const SubText = styled.Text({
  ...textStyles.alert1,
  color: colors.gray01,
});

const DotText = styled.Text({
  ...textStyles.alert1,
  color: colors.white,
});

const RatingWrapper = styled.View({
  alignItems: 'center',
});

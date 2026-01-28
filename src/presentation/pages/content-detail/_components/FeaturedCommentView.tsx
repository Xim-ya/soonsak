import React from 'react';
import { TouchableOpacity } from 'react-native';
import styled from '@emotion/native';
import { RoundedAvatorView } from '@/presentation/components/image/RoundedAvatarView';
import { SkeletonView } from '@/presentation/components/loading/SkeletonView';
import Gap from '@/presentation/components/view/Gap';
import colors from '@/shared/styles/colors';
import textStyles from '@/shared/styles/textStyles';
import { useFeaturedComment } from '../_hooks/useFeaturedComment';
import RightArrowIcon from '@assets/icons/right_arrrow.svg';

interface FeaturedCommentViewProps {
  /** 전체 댓글 바텀시트 열기 콜백 */
  readonly onPressShowAll: () => void;
}

/**
 * FeaturedCommentView - 대표 감상평 섹션 컴포넌트
 *
 * 좋아요가 가장 많은 댓글 중 채널 주인이 작성하지 않은 댓글을 대표 댓글로 표시합니다.
 * 댓글 클릭 시 전체 댓글 바텀시트를 엽니다.
 *
 * @example
 * <FeaturedCommentView onPressShowAll={() => setShowBottomSheet(true)} />
 */
function FeaturedCommentView({
  onPressShowAll,
}: FeaturedCommentViewProps): React.ReactElement | null {
  const { featuredComment, totalCountText, isLoading, error } = useFeaturedComment();

  // 에러 발생 시 또는 댓글이 없으면 렌더링하지 않음
  if (error || (!isLoading && !featuredComment)) {
    return null;
  }

  return (
    <Container>
      <HeaderContainer>
        <SectionTitle>대표 감상평</SectionTitle>
        {totalCountText && <CommentCount>{totalCountText}</CommentCount>}
      </HeaderContainer>
      <Gap size={16} />

      {isLoading ? (
        <LoadingSkeleton />
      ) : (
        featuredComment && (
          <>
            <TouchableOpacity onPress={onPressShowAll} activeOpacity={0.8}>
              <CommentContainer>
                <AvatarContainer>
                  <RoundedAvatorView source={featuredComment.authorProfileImageUrl} size={36} />
                </AvatarContainer>
                <ContentContainer>
                  <HeaderRow>
                    <AuthorName numberOfLines={1}>{featuredComment.authorName}</AuthorName>
                    <PublishedTime>{featuredComment.publishedTimeText}</PublishedTime>
                  </HeaderRow>
                  <Gap size={4} />
                  <CommentText numberOfLines={3}>{featuredComment.content}</CommentText>
                  <Gap size={8} />
                  <MetricsRow>
                    {featuredComment.likeCountText && (
                      <LikeCount>👍 {featuredComment.likeCountText}</LikeCount>
                    )}
                    {featuredComment.isHearted && <HeartedBadge>❤️</HeartedBadge>}
                  </MetricsRow>
                </ContentContainer>
              </CommentContainer>
            </TouchableOpacity>

            <Gap size={12} />

            <ShowAllButton onPress={onPressShowAll} activeOpacity={0.7}>
              <ShowAllText>전체 댓글 보기</ShowAllText>
              <RightArrowIcon width={16} height={16} />
            </ShowAllButton>
          </>
        )
      )}
    </Container>
  );
}

/**
 * 로딩 스켈레톤
 */
function LoadingSkeleton(): React.ReactElement {
  return (
    <SkeletonContainer>
      <AvatarContainer>
        <SkeletonView width={36} height={36} borderRadius={18} />
      </AvatarContainer>
      <ContentContainer>
        <SkeletonView width={100} height={14} borderRadius={4} />
        <Gap size={8} />
        <SkeletonView width={280} height={14} borderRadius={4} />
        <Gap size={4} />
        <SkeletonView width={220} height={14} borderRadius={4} />
      </ContentContainer>
    </SkeletonContainer>
  );
}

/* Styled Components */
const Container = styled.View({
  backgroundColor: colors.black,
  paddingTop: 24,
  paddingBottom: 24,
  paddingHorizontal: 16,
});

const HeaderContainer = styled.View({
  flexDirection: 'row',
  alignItems: 'center',
});

const SectionTitle = styled.Text({
  ...textStyles.title2,
  color: colors.white,
});

const CommentCount = styled.Text({
  ...textStyles.body3,
  color: colors.gray02,
  marginLeft: 8,
});

const CommentContainer = styled.View({
  flexDirection: 'row',
});

const SkeletonContainer = styled.View({
  flexDirection: 'row',
});

const AvatarContainer = styled.View({
  marginRight: 12,
});

const ContentContainer = styled.View({
  flex: 1,
});

const HeaderRow = styled.View({
  flexDirection: 'row',
  alignItems: 'center',
});

const AuthorName = styled.Text({
  ...textStyles.alert1,
  color: colors.white,
  flex: 1,
});

const PublishedTime = styled.Text({
  ...textStyles.alert2,
  color: colors.gray02,
  marginLeft: 8,
});

const CommentText = styled.Text({
  ...textStyles.body3,
  color: colors.white,
  lineHeight: 20,
});

const MetricsRow = styled.View({
  flexDirection: 'row',
  alignItems: 'center',
});

const LikeCount = styled.Text({
  ...textStyles.alert2,
  color: colors.gray02,
});

const HeartedBadge = styled.Text({
  marginLeft: 8,
});

const ShowAllButton = styled.TouchableOpacity({
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  paddingVertical: 12,
  paddingHorizontal: 16,
  backgroundColor: colors.gray05,
  borderRadius: 8,
});

const ShowAllText = styled.Text({
  ...textStyles.body2,
  color: colors.white,
  marginRight: 4,
});

export { FeaturedCommentView };

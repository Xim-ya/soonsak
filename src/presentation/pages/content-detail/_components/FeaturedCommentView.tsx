import React from 'react';
import { TouchableOpacity } from 'react-native';
import styled from '@emotion/native';
import Gap from '@/presentation/components/view/Gap';
import colors from '@/shared/styles/colors';
import textStyles from '@/shared/styles/textStyles';
import { useFeaturedComment } from '../_hooks/useFeaturedComment';
import { CommentItemView } from './CommentItemView';
import { CommentSkeletonView } from './CommentSkeletonView';
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
        <CommentSkeletonView />
      ) : (
        featuredComment && (
          <>
            <TouchableOpacity onPress={onPressShowAll} activeOpacity={0.8}>
              <CommentItemView
                comment={featuredComment}
                maxLines={3}
                showReplyCount={false}
                showPinnedBadge={false}
              />
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

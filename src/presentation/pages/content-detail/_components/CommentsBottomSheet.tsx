import React, { memo, useMemo, useEffect, useCallback } from 'react';
import { Modal, FlatList } from 'react-native';
import styled from '@emotion/native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  runOnJS,
  Easing,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';
import { RoundedAvatorView } from '@/presentation/components/image/RoundedAvatarView';
import { SkeletonView } from '@/presentation/components/loading/SkeletonView';
import Gap from '@/presentation/components/view/Gap';
import colors from '@/shared/styles/colors';
import textStyles from '@/shared/styles/textStyles';
import { AppSize } from '@/shared/utils/appSize';
import { useYouTubeComments } from '@/features/youtube';
import { useContentVideos } from '../_provider/ContentDetailProvider';
import { CommentModel } from '../_types/commentModel.cd';
import CloseIcon from '@assets/icons/back_arrow.svg';

interface CommentsBottomSheetProps {
  /** 바텀시트 표시 여부 */
  readonly visible: boolean;
  /** 바텀시트 닫기 콜백 */
  readonly onClose: () => void;
}

interface CommentItemProps {
  readonly comment: CommentModel;
}

/**
 * 개별 댓글 아이템 컴포넌트
 */
const CommentItem = memo(function CommentItem({ comment }: CommentItemProps) {
  return (
    <CommentItemContainer>
      <AvatarContainer>
        <RoundedAvatorView source={comment.authorProfileImageUrl} size={36} />
      </AvatarContainer>
      <ContentContainer>
        <HeaderRow>
          <AuthorName numberOfLines={1}>{comment.authorName}</AuthorName>
          <PublishedTime>{comment.publishedTimeText}</PublishedTime>
          {comment.isPinned && <PinnedBadge>고정</PinnedBadge>}
        </HeaderRow>
        <Gap size={4} />
        <CommentText>{comment.content}</CommentText>
        <Gap size={8} />
        <MetricsRow>
          {comment.likeCountText && <LikeCount>👍 {comment.likeCountText}</LikeCount>}
          {comment.isHearted && <HeartedBadge>❤️</HeartedBadge>}
          {comment.replyCount > 0 && <ReplyCount>답글 {comment.replyCount}개</ReplyCount>}
        </MetricsRow>
      </ContentContainer>
    </CommentItemContainer>
  );
});

/**
 * 댓글 아이템 구분선
 */
const ItemSeparator = (): React.ReactElement => <Gap size={16} />;

/**
 * 댓글 스켈레톤 아이템
 */
function CommentSkeleton(): React.ReactElement {
  return (
    <CommentItemContainer>
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
    </CommentItemContainer>
  );
}

/**
 * 로딩 스켈레톤 리스트
 */
function LoadingSkeleton(): React.ReactElement {
  return (
    <>
      <CommentSkeleton />
      <Gap size={16} />
      <CommentSkeleton />
      <Gap size={16} />
      <CommentSkeleton />
      <Gap size={16} />
      <CommentSkeleton />
    </>
  );
}

/**
 * CommentsBottomSheet - 유튜브 스타일의 전체 댓글 바텀시트 모달
 *
 * 현재 재생 중인 비디오의 전체 댓글 목록을 스크롤 가능한 바텀시트로 표시합니다.
 * 배경 터치 또는 닫기 버튼으로 닫을 수 있습니다.
 *
 * @example
 * // 기본 사용법
 * const [isVisible, setIsVisible] = useState(false);
 *
 * <CommentsBottomSheet
 *   visible={isVisible}
 *   onClose={() => setIsVisible(false)}
 * />
 */
// 바텀시트 높이 상수
const SHEET_HEIGHT = AppSize.screenHeight * 0.8;
const CLOSE_THRESHOLD = SHEET_HEIGHT * 0.25; // 25% 이상 드래그하면 닫기

function CommentsBottomSheet({ visible, onClose }: CommentsBottomSheetProps): React.ReactElement {
  const { primaryVideo, commentToken, commentTotalCountText, isCommentTokenLoading } =
    useContentVideos();
  const videoId = primaryVideo?.id;

  // 애니메이션 값
  const overlayOpacity = useSharedValue(0);
  const sheetTranslateY = useSharedValue(SHEET_HEIGHT);

  // 닫기 애니메이션 후 실제로 모달 닫기
  const handleClose = useCallback(() => {
    overlayOpacity.value = withTiming(0, { duration: 200 });
    sheetTranslateY.value = withTiming(
      SHEET_HEIGHT,
      { duration: 250, easing: Easing.inOut(Easing.ease) },
      () => {
        runOnJS(onClose)();
      },
    );
  }, [onClose, overlayOpacity, sheetTranslateY]);

  // visible 상태에 따른 애니메이션
  useEffect(() => {
    if (visible) {
      overlayOpacity.value = withTiming(1, { duration: 200 });
      sheetTranslateY.value = withTiming(0, { duration: 300, easing: Easing.out(Easing.ease) });
    }
  }, [visible, overlayOpacity, sheetTranslateY]);

  // 드래그 제스처
  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      // 아래로 드래그만 허용 (양수 값)
      if (event.translationY > 0) {
        sheetTranslateY.value = event.translationY;
        // 오버레이 투명도도 드래그에 따라 감소
        overlayOpacity.value = interpolate(
          event.translationY,
          [0, SHEET_HEIGHT],
          [1, 0],
          Extrapolation.CLAMP,
        );
      }
    })
    .onEnd((event) => {
      // 임계값 이상 드래그했거나 빠른 속도로 드래그하면 닫기
      if (event.translationY > CLOSE_THRESHOLD || event.velocityY > 500) {
        runOnJS(handleClose)();
      } else {
        // 원래 위치로 부드럽게 복귀
        sheetTranslateY.value = withTiming(0, {
          duration: 200,
          easing: Easing.out(Easing.ease),
        });
        overlayOpacity.value = withTiming(1, { duration: 150 });
      }
    });

  // 오버레이 애니메이션 스타일
  const overlayAnimatedStyle = useAnimatedStyle(() => ({
    opacity: overlayOpacity.value,
  }));

  // 바텀시트 애니메이션 스타일
  const sheetAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: sheetTranslateY.value }],
  }));

  // prefetch된 token 사용
  const {
    data: commentsData,
    isLoading,
    error,
  } = useYouTubeComments(videoId, {
    token: commentToken,
    totalCountText: commentTotalCountText,
    isTokenLoading: isCommentTokenLoading,
  });

  // DTO를 Model로 변환
  const comments = useMemo(() => {
    if (!commentsData?.comments) return [];
    return CommentModel.fromDtoList(commentsData.comments);
  }, [commentsData?.comments]);

  // 표시할 총 댓글 수
  const displayCountText = commentsData?.totalCountText || commentTotalCountText;

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={handleClose}>
      <ModalContainer>
        {/* 배경 오버레이 */}
        <Overlay style={overlayAnimatedStyle} onTouchEnd={handleClose} />

        {/* 바텀시트 컨테이너 */}
        <SheetContainer style={sheetAnimatedStyle}>
          {/* 드래그 핸들 영역 */}
          <GestureDetector gesture={panGesture}>
            <DragArea>
              <HandleContainer>
                <Handle />
              </HandleContainer>

              {/* 헤더 */}
              <HeaderContainer>
                <HeaderLeftSection>
                  <HeaderTitle>댓글</HeaderTitle>
                  {displayCountText && <CommentCount>{displayCountText}</CommentCount>}
                </HeaderLeftSection>
                <CloseButton onPress={handleClose}>
                  <CloseIcon width={24} height={24} style={{ transform: [{ rotate: '90deg' }] }} />
                </CloseButton>
              </HeaderContainer>

              {/* 구분선 */}
              <Divider />
            </DragArea>
          </GestureDetector>

          {/* 댓글 리스트 */}
          {isLoading ? (
            <ScrollContainer>
              <LoadingSkeleton />
            </ScrollContainer>
          ) : error || comments.length === 0 ? (
            <EmptyContainer>
              <EmptyText>댓글이 없습니다.</EmptyText>
            </EmptyContainer>
          ) : (
            <FlatList
              data={comments}
              renderItem={({ item }) => <CommentItem comment={item} />}
              keyExtractor={(item) => item.id}
              ItemSeparatorComponent={ItemSeparator}
              contentContainerStyle={{
                paddingHorizontal: 16,
                paddingTop: 16,
                paddingBottom: AppSize.bottomInset + 16,
              }}
              showsVerticalScrollIndicator={false}
            />
          )}
        </SheetContainer>
      </ModalContainer>
    </Modal>
  );
}

/* Styled Components */

const ModalContainer = styled.View({
  flex: 1,
});

const Overlay = styled(Animated.View)({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.6)',
});

const SheetContainer = styled(Animated.View)({
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  height: SHEET_HEIGHT,
  backgroundColor: colors.gray05,
  borderTopLeftRadius: 16,
  borderTopRightRadius: 16,
});

const DragArea = styled(Animated.View)({});

const HandleContainer = styled.View({
  alignItems: 'center',
  paddingTop: 8,
  paddingBottom: 4,
});

const Handle = styled.View({
  width: 36,
  height: 4,
  borderRadius: 2,
  backgroundColor: colors.gray03,
});

const HeaderContainer = styled.View({
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  paddingHorizontal: 16,
  paddingTop: 16,
  paddingBottom: 12,
});

const HeaderLeftSection = styled.View({
  flexDirection: 'row',
  alignItems: 'center',
  flex: 1,
});

const HeaderTitle = styled.Text({
  ...textStyles.title2,
  color: colors.white,
});

const CommentCount = styled.Text({
  ...textStyles.body3,
  color: colors.gray02,
  marginLeft: 8,
});

const CloseButton = styled.TouchableOpacity({
  padding: 4,
});

const Divider = styled.View({
  height: 1,
  backgroundColor: colors.gray04,
});

const ScrollContainer = styled.ScrollView({
  flex: 1,
  paddingHorizontal: 16,
  paddingTop: 16,
});

const EmptyContainer = styled.View({
  flex: 1,
  alignItems: 'center',
  justifyContent: 'center',
  paddingVertical: 40,
});

const EmptyText = styled.Text({
  ...textStyles.body2,
  color: colors.gray02,
});

const CommentItemContainer = styled.View({
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

const ReplyCount = styled.Text({
  ...textStyles.alert2,
  color: colors.gray02,
  marginLeft: 12,
});

const PinnedBadge = styled.Text({
  ...textStyles.alert2,
  color: colors.gray02,
  marginLeft: 8,
});

const HeartedBadge = styled.Text({
  marginLeft: 8,
});

export { CommentsBottomSheet };

/**
 * RatingBottomSheet - 평점 등록 바텀시트
 *
 * 콘텐츠에 별점을 매기는 바텀시트입니다.
 * - 0.5 단위로 평점 선택 가능
 * - 터치 및 드래그로 별점 선택
 * - 기존 평점이 있으면 표시
 */

import React, { useCallback, useEffect, useState } from 'react';
import { Modal } from 'react-native';
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
import colors from '@/shared/styles/colors';
import textStyles from '@/shared/styles/textStyles';
import { AppSize } from '@/shared/utils/appSize';
import { InteractiveStarRating } from '@/presentation/components/rating';

// 상수 정의
const CONTENT_HEIGHT = 95;
const CLOSE_BUTTON_HEIGHT = 56;
const SPACING = 8;
const BORDER_RADIUS = 12;

const STAR_SIZE = 28;
const STAR_GAP = 6;

interface RatingBottomSheetProps {
  /** 바텀시트 표시 여부 */
  readonly visible: boolean;
  /** 콘텐츠 제목 */
  readonly contentTitle: string;
  /** 현재 평점 (null이면 없음) */
  readonly currentRating: number | null;
  /** 평점 등록 콜백 */
  readonly onSubmitRating: (rating: number) => void;
  /** 닫기 콜백 */
  readonly onClose: () => void;
}

function RatingBottomSheet({
  visible,
  contentTitle,
  currentRating,
  onSubmitRating,
  onClose,
}: RatingBottomSheetProps) {
  // 시트 높이 계산
  const sheetHeight =
    CONTENT_HEIGHT + SPACING + CLOSE_BUTTON_HEIGHT + AppSize.responsiveBottomInset + 12;
  const closeThreshold = sheetHeight * 0.25;

  // 선택된 평점 상태
  const [selectedRating, setSelectedRating] = useState<number>(currentRating ?? 0);

  // 애니메이션 값
  const overlayOpacity = useSharedValue(0);
  const sheetTranslateY = useSharedValue(sheetHeight);

  // visible 상태 변경 시 초기화
  useEffect(() => {
    if (visible) {
      setSelectedRating(currentRating ?? 0);
      overlayOpacity.value = withTiming(1, { duration: 200 });
      sheetTranslateY.value = withTiming(0, {
        duration: 300,
        easing: Easing.out(Easing.ease),
      });
    } else {
      overlayOpacity.value = 0;
      sheetTranslateY.value = sheetHeight;
    }
  }, [visible, currentRating, overlayOpacity, sheetTranslateY, sheetHeight]);

  // 닫기 애니메이션
  const handleClose = useCallback(() => {
    overlayOpacity.value = withTiming(0, { duration: 200 });
    sheetTranslateY.value = withTiming(
      sheetHeight,
      { duration: 250, easing: Easing.inOut(Easing.ease) },
      () => {
        runOnJS(onClose)();
      },
    );
  }, [onClose, overlayOpacity, sheetTranslateY, sheetHeight]);

  // 평점 제출 핸들러
  const handleSubmitRating = useCallback(
    (rating: number) => {
      onSubmitRating(rating);
      handleClose();
    },
    [onSubmitRating, handleClose],
  );

  // 별점 변경 핸들러 (null 처리)
  const handleRatingChange = useCallback((rating: number | null) => {
    setSelectedRating(rating ?? 0);
  }, []);

  // 드래그 제스처 (바텀시트 닫기용)
  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      if (event.translationY > 0) {
        sheetTranslateY.value = event.translationY;
        overlayOpacity.value = interpolate(
          event.translationY,
          [0, sheetHeight],
          [1, 0],
          Extrapolation.CLAMP,
        );
      }
    })
    .onEnd((event) => {
      if (event.translationY > closeThreshold || event.velocityY > 500) {
        runOnJS(handleClose)();
      } else {
        sheetTranslateY.value = withTiming(0, {
          duration: 200,
          easing: Easing.out(Easing.ease),
        });
        overlayOpacity.value = withTiming(1, { duration: 150 });
      }
    });

  // 애니메이션 스타일
  const overlayAnimatedStyle = useAnimatedStyle(() => ({
    opacity: overlayOpacity.value,
  }));

  const sheetAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: sheetTranslateY.value }],
  }));

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={handleClose}>
      <ModalContainer>
        {/* 배경 오버레이 */}
        <Overlay style={overlayAnimatedStyle} onTouchEnd={handleClose} />

        {/* 바텀시트 컨테이너 */}
        <SheetContainer style={sheetAnimatedStyle} height={sheetHeight}>
          <ContentWrapper>
            {/* 드래그 핸들 */}
            <GestureDetector gesture={panGesture}>
              <DragArea>
                <HandleContainer>
                  <Handle />
                </HandleContainer>
              </DragArea>
            </GestureDetector>

            {/* 콘텐츠 영역 */}
            <ContentArea>
              {/* 제목 */}
              <TitleText numberOfLines={2}>{contentTitle}</TitleText>

              {/* 별점 선택 영역 */}
              <InteractiveStarRating
                value={selectedRating}
                onChange={handleRatingChange}
                onDragEnd={handleSubmitRating}
                mode="drag"
                step={0.5}
                size={STAR_SIZE}
                gap={STAR_GAP}
              />
            </ContentArea>

            {/* 스페이서 */}
            <Spacer />

            {/* 취소 버튼 */}
            <CloseButton onPress={handleClose} activeOpacity={0.7}>
              <CloseButtonText>취소</CloseButtonText>
            </CloseButton>
          </ContentWrapper>
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
  backgroundColor: colors.overlay,
});

const SheetContainer = styled(Animated.View)<{ height: number }>(({ height }) => ({
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  height,
  paddingHorizontal: 16,
}));

const ContentWrapper = styled.View({
  flex: 1,
});

const DragArea = styled(Animated.View)({});

const HandleContainer = styled.View({
  alignItems: 'center',
  paddingTop: 8,
  paddingBottom: 12,
});

const Handle = styled.View({
  width: 36,
  height: 4,
  borderRadius: 2,
  backgroundColor: colors.gray03,
});

const ContentArea = styled.View({
  backgroundColor: colors.gray06,
  borderRadius: BORDER_RADIUS,
  paddingVertical: 16,
  paddingHorizontal: 20,
  alignItems: 'center',
});

const TitleText = styled.Text({
  ...textStyles.alert1,
  color: colors.gray01,
  textAlign: 'center',
  marginBottom: 10,
});

const Spacer = styled.View({
  height: SPACING,
});

const CloseButton = styled.TouchableOpacity({
  height: CLOSE_BUTTON_HEIGHT,
  backgroundColor: colors.gray06,
  borderRadius: BORDER_RADIUS,
  alignItems: 'center',
  justifyContent: 'center',
});

const CloseButtonText = styled.Text({
  ...textStyles.body2,
  color: colors.white,
});

export { RatingBottomSheet };

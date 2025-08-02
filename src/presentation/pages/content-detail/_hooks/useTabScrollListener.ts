import { useCallback, useRef } from 'react';
import { useCurrentTabScrollY } from 'react-native-collapsible-tab-view';
import { runOnJS, useAnimatedReaction } from 'react-native-reanimated';

/**
 * 탭 스크롤 이벤트를 감지하여 AppBar 투명도 제어를 위한 커스텀 훅
 * 
 * 주요 기능:
 * - react-native-collapsible-tab-view의 스크롤 Y 값 실시간 감지
 * - 스크롤 오프셋 269px 기준으로 AppBar 투명도 변경 시점 결정
 * - 성능 최적화: 불필요한 콜백 호출 방지 (상태 변경시만 호출)
 * - 디버깅용 로그 출력 (10px 이상 변경시만)
 * 
 * @param onScrollChange - 스크롤 오프셋이 269px 기준점을 넘나들 때 호출되는 콜백 함수
 */
const useTabScrollListener = (onScrollChange: (offset: number) => void) => {
  const scrollY = useCurrentTabScrollY();
  const lastLoggedOffset = useRef(0);
  const lastOpacityChange = useRef(0);

  // 메모이제이션된 로그 함수
  const logScrollOffset = useCallback(
    (offset: number) => {
      // 로그 출력 최적화 (10픽셀 이상 변경시만)
      if (Math.abs(offset - lastLoggedOffset.current) >= 10) {
        console.log(`[ContentDetailPage] 스크롤 오프셋: ${offset.toFixed(2)}`);
        lastLoggedOffset.current = offset;
      }

      // opacity 변경이 필요한 경우만 콜백 호출 (성능 최적화)
      const shouldShowAppBar = offset >= 269.0;
      const lastShouldShow = lastOpacityChange.current >= 269.0;
      if (shouldShowAppBar !== lastShouldShow) {
        lastOpacityChange.current = offset;
        onScrollChange(offset);
      }
    },
    [onScrollChange],
  );

  // 스크롤 변화 감지 - 쓰로틀링 적용
  useAnimatedReaction(
    () => scrollY.value,
    (currentValue) => {
      runOnJS(logScrollOffset)(currentValue);
    },
    [], // dependency 배열 최적화
  );
};

export { useTabScrollListener };

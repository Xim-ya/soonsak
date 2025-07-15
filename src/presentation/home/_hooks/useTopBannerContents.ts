import { useQuery } from '@tanstack/react-query';
import { useSharedValue, withTiming } from 'react-native-reanimated';
import { ICarouselInstance } from 'react-native-reanimated-carousel';
import React from 'react';
import { TopContentModel, topContentMock } from '../types/TopContentModel';
import { contentApi } from '@/features/content/api/contentApi';

/**
 * - 콘텐츠 캐러셀 인터렉션
 * - 헤다 상단 콘텐츠 호출
 */
export function useTopBannerConetns() {
  const ref = React.useRef<ICarouselInstance>(null);
  const progress = useSharedValue<number>(0);
  const infoOpacity = useSharedValue<number>(1);
  const [currentItem, setCurrentItem] = React.useState<TopContentModel | null>(
    null
  );

  const { data, isError, isLoading } = useQuery({
    queryKey: ['topContent'],
    queryFn: async (): Promise<TopContentModel[]> => {
      await new Promise(resolve => setTimeout(resolve, 200)); // 200ms 딜레이
      return topContentMock;
    },
  });

  const headerInfo = data ?? [];

  const onPressPagination = (index: number) => {
    ref.current?.scrollTo({
      count: index - progress.value,
      animated: true,
    });
  };

  // 페이지 변경 시 opacity 애니메이션 처리
  const onProgressChange = (
    offsetProgress: number,
    absoluteProgress: number
  ) => {
    progress.value = absoluteProgress;

    // 중간 지점에서 아이템 변경 (Flutter와 동일한 로직)
    if (headerInfo && headerInfo.length > 0) {
      const remainder = absoluteProgress % 1;

      // 0.5 이상일 때 다음 아이템으로 변경
      const targetIndex =
        remainder >= 0.5
          ? Math.ceil(absoluteProgress)
          : Math.floor(absoluteProgress);
      const safeIndex = targetIndex % headerInfo.length;
      const item = headerInfo[safeIndex];

      if (item && item !== currentItem) {
        setCurrentItem(item);
      }
    }

    // Opacity 애니메이션 처리
    const remainder = absoluteProgress % 1;
    const opacity = 1 - remainder;

    if (opacity > 0.6) {
      infoOpacity.value = withTiming(opacity, { duration: 100 });
    } else if (opacity > 0.48 && opacity < 0.52) {
      infoOpacity.value = withTiming(0, { duration: 100 });
    } else {
      infoOpacity.value = withTiming(remainder, { duration: 100 });
    }
  };

  // 스냅 완료 시 호출되는 함수
  const onSnapToItem = (index: number) => {
    if (
      headerInfo &&
      headerInfo.length > 0 &&
      index >= 0 &&
      index < headerInfo.length
    ) {
      const item = headerInfo[index];
      if (item) {
        setCurrentItem(item);
      }
    }
  };

  // 초기 아이템 설정
  React.useEffect(() => {
    if (headerInfo.length > 0 && !currentItem) {
      const firstItem = headerInfo[0];
      if (firstItem) {
        setCurrentItem(firstItem);
      }
    }
  }, [headerInfo, currentItem]);

  return {
    // Data
    headerInfo,
    currentItem,
    isError,
    isLoading,

    // Refs & Values
    ref,
    progress,
    infoOpacity,

    // Handlers
    onPressPagination,
    onProgressChange,
    onSnapToItem,
  };
}

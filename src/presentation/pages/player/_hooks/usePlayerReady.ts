/**
 * usePlayerReady - 플레이어 준비 및 초기화 로직
 *
 * 역할:
 * - 플레이어 준비 상태 관리
 * - ready 이벤트 처리
 * - 재생수 증가 + 시청 기록 저장 (1회만)
 * - iOS 음소거 해제
 */

import { useState, useRef } from 'react';
import { Platform } from 'react-native';
import type { useYouTubePlayer } from 'react-native-youtube-bridge';
import { contentApi } from '@/features/content/api/contentApi';
import { useAddWatchHistory } from '@/features/watch-history';
import type { ContentType } from '@/presentation/types/content/contentType.enum';

interface UsePlayerReadyParams {
  readonly contentId: number;
  readonly contentType: ContentType;
  readonly videoId: string;
  readonly isFallbackMode: boolean;
  readonly player: ReturnType<typeof useYouTubePlayer>;
}

interface PlayerReadyResult {
  readonly isPlayerReady: boolean;
  /** ready 이벤트 핸들러 - useYouTubeEvent에 전달 */
  readonly handleReady: () => void;
}

export function usePlayerReady({
  contentId,
  contentType,
  videoId,
  isFallbackMode,
  player,
}: UsePlayerReadyParams): PlayerReadyResult {
  const [isPlayerReady, setIsPlayerReady] = useState(false);
  const hasIncrementedPlayCount = useRef(false);

  const { mutate: addWatchHistory } = useAddWatchHistory();

  const handleReady = () => {
    console.log('플레이어 준비 완료');

    if (!isFallbackMode) {
      setIsPlayerReady(true);
    }

    // 재생수 증가 + 시청 기록 저장 (1회만 실행)
    const shouldTrackPlayCount = !hasIncrementedPlayCount.current;
    if (shouldTrackPlayCount) {
      hasIncrementedPlayCount.current = true;
      contentApi.incrementPlayCount(contentId, contentType);

      addWatchHistory({
        contentId,
        contentType,
        videoId,
      });
    }

    // iOS에서 음소거 상태로 자동 재생 후 음소거 해제
    if (Platform.OS === 'ios') {
      setTimeout(() => {
        player.unMute();
      }, 500);
    }
  };

  return {
    isPlayerReady,
    handleReady,
  };
}

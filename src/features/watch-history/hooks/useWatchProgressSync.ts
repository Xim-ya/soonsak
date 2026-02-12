/**
 * useWatchProgressSync - 시청 진행률 동기화 훅
 *
 * 동기화 전략:
 * - 20초 간격 자동 동기화
 * - 일시정지 시 즉시 동기화
 * - 페이지 이탈 시 즉시 동기화
 * - Seek(탐색) 시 debounce 동기화 (3초 이상 시간 점프 감지, 300ms 대기)
 */

import { useRef, useCallback, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { watchHistoryApi } from '../api/watchHistoryApi';
import { watchHistoryKeys } from './useWatchHistory';
import type { ContentType } from '@/presentation/types/content/contentType.enum';

/** YouTube 플레이어 상태 상수 */
const PLAYER_STATE = {
  UNSTARTED: -1,
  ENDED: 0,
  PLAYING: 1,
  PAUSED: 2,
  BUFFERING: 3,
  CUED: 5,
} as const;

/** 동기화 간격 (밀리초) */
const SYNC_INTERVAL_MS = 20_000;

/** Seek 감지 임계값 (초) - 이 값 이상 시간 점프 시 seek로 간주 */
const SEEK_THRESHOLD_SECONDS = 3;

/** Seek 동기화 debounce 딜레이 (밀리초) */
const SEEK_DEBOUNCE_MS = 300;

interface UseWatchProgressSyncParams {
  readonly contentId: number;
  readonly contentType: ContentType;
  readonly videoId: string;
}

interface WatchProgressSyncResult {
  /** 진행률 업데이트 (1초마다 호출) */
  updateProgress: (currentTime: number, duration: number) => void;
  /** 플레이어 상태 변경 핸들러 */
  handleStateChange: (state: number) => void;
  /** 즉시 동기화 (페이지 이탈 시 호출) */
  syncNow: () => Promise<void>;
}

export function useWatchProgressSync({
  contentId,
  contentType,
  videoId,
}: UseWatchProgressSyncParams): WatchProgressSyncResult {
  const queryClient = useQueryClient();
  const progressRef = useRef({ currentTime: 0, duration: 0 });
  const lastSyncTimeRef = useRef(0);
  const lastProgressTimeRef = useRef(0); // seek 감지용 이전 재생 시간
  const syncIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const seekDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null); // seek debounce 타이머
  const isSyncingRef = useRef(false);

  /** 서버에 진행률 동기화 */
  const syncToServer = useCallback(async () => {
    const { currentTime, duration } = progressRef.current;

    const hasValidProgress = currentTime > 0 && duration > 0;
    if (!hasValidProgress) return;

    const isAlreadySyncing = isSyncingRef.current;
    if (isAlreadySyncing) return;

    isSyncingRef.current = true;

    try {
      await watchHistoryApi.updateWatchProgress({
        contentId,
        contentType,
        videoId,
        progressSeconds: Math.floor(currentTime),
        durationSeconds: Math.floor(duration),
      });
      lastSyncTimeRef.current = Date.now();

      // 동기화 성공 후 관련 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: watchHistoryKeys.all });
    } catch (error) {
      console.error('시청 진행률 동기화 실패:', error);
    } finally {
      isSyncingRef.current = false;
    }
  }, [contentId, contentType, videoId, queryClient]);

  /** 영상 완료 처리 (끝까지 재생 시) */
  const markComplete = useCallback(async () => {
    const { duration } = progressRef.current;
    if (duration <= 0) return;

    try {
      await watchHistoryApi.markAsFullyWatched(contentId, contentType, Math.floor(duration));

      // 완료 처리 후 관련 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: watchHistoryKeys.all });
    } catch (error) {
      console.error('영상 완료 처리 실패:', error);
    }
  }, [contentId, contentType, queryClient]);

  /** 진행률 업데이트 (1초마다 플레이어에서 호출) */
  const updateProgress = useCallback(
    (currentTime: number, duration: number) => {
      const lastTime = lastProgressTimeRef.current;
      const timeDiff = Math.abs(currentTime - lastTime);

      const hasTimeJump = lastTime > 0 && timeDiff >= SEEK_THRESHOLD_SECONDS;

      progressRef.current = { currentTime, duration };
      lastProgressTimeRef.current = currentTime;

      if (hasTimeJump) {
        if (seekDebounceRef.current) {
          clearTimeout(seekDebounceRef.current);
        }
        seekDebounceRef.current = setTimeout(() => {
          syncToServer();
          seekDebounceRef.current = null;
        }, SEEK_DEBOUNCE_MS);
      }
    },
    [syncToServer],
  );

  /** 주기적 동기화 시작 */
  const startPeriodicSync = useCallback(() => {
    if (syncIntervalRef.current) {
      return;
    }

    syncIntervalRef.current = setInterval(() => {
      const timeSinceLastSync = Date.now() - lastSyncTimeRef.current;
      if (timeSinceLastSync >= SYNC_INTERVAL_MS) {
        syncToServer();
      }
    }, SYNC_INTERVAL_MS);
  }, [syncToServer]);

  /** 주기적 동기화 중지 */
  const stopPeriodicSync = useCallback(() => {
    if (syncIntervalRef.current) {
      clearInterval(syncIntervalRef.current);
      syncIntervalRef.current = null;
    }
  }, []);

  /** 플레이어 상태 변경 핸들러 */
  const handleStateChange = useCallback(
    (state: number) => {
      if (state === PLAYER_STATE.PLAYING) {
        startPeriodicSync();
      } else if (state === PLAYER_STATE.PAUSED) {
        stopPeriodicSync();
        syncToServer();
      } else if (state === PLAYER_STATE.ENDED) {
        // 영상이 끝까지 재생됨 - 확실하게 완료 처리
        stopPeriodicSync();
        markComplete();
      }
    },
    [startPeriodicSync, stopPeriodicSync, syncToServer, markComplete],
  );

  /** 즉시 동기화 (외부에서 호출 가능) */
  const syncNow = useCallback(async () => {
    stopPeriodicSync();
    await syncToServer();
  }, [stopPeriodicSync, syncToServer]);

  // cleanup on unmount
  useEffect(() => {
    return () => {
      stopPeriodicSync();
      if (seekDebounceRef.current) {
        clearTimeout(seekDebounceRef.current);
      }
    };
  }, [stopPeriodicSync]);

  return {
    updateProgress,
    handleStateChange,
    syncNow,
  };
}

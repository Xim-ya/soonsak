/**
 * useContentInfoActions - 콘텐츠 정보 영역의 찜/평점 액션 관리 훅
 *
 * 책임:
 * - 찜 상태 및 토글
 * - 평점 상태 및 등록
 * - 로그인 다이얼로그 상태
 * - 평점 바텀시트 상태
 * - 로그인 후 pending 액션 처리
 *
 * Toss Frontend Fundamentals - 응집도 원칙:
 * 같은 목적의 코드(찜/평점 액션)를 한 곳에 뭉쳐서 관리합니다.
 */

import { useCallback, useState, useEffect } from 'react';
import { useAuth } from '@/shared/providers/AuthProvider';
import { useFavoriteStatus, useToggleFavorite } from '@/features/favorites';
import { useRatingStatus, useSetRating } from '@/features/ratings';
import {
  usePendingFavoriteAction,
  usePendingRatingAction,
  usePendingActionActions,
  getPendingFavoriteAction,
} from '@/shared/stores/pendingActionStore';
import type { ContentType } from '@/presentation/types/content/contentType.enum';

interface UseContentInfoActionsParams {
  readonly contentId: number;
  readonly contentType: ContentType;
  readonly contentTitle: string;
}

interface UseContentInfoActionsReturn {
  /** 찜 상태 */
  readonly isFavorited: boolean;
  /** 평점 상태 */
  readonly hasRating: boolean;
  /** 현재 평점 (0.5~5.0) */
  readonly currentRating: number | null;
  /** 로그인 다이얼로그 표시 여부 */
  readonly isLoginDialogVisible: boolean;
  /** 평점 바텀시트 표시 여부 */
  readonly isRatingSheetVisible: boolean;
  /** 찜 버튼 클릭 핸들러 */
  readonly handleFavoritePress: () => void;
  /** 평점 버튼 클릭 핸들러 */
  readonly handleRatingPress: () => void;
  /** 평점 등록 핸들러 */
  readonly handleSubmitRating: (rating: number) => void;
  /** 평점 바텀시트 닫기 */
  readonly handleCloseRatingSheet: () => void;
  /** 로그인 다이얼로그 닫기 */
  readonly handleCloseDialog: () => void;
  /** 찜 토글 실행 (카카오 로그인 성공 콜백용) */
  readonly executeFavoriteToggle: () => void;
  /** 평점 액션 실행 (카카오 로그인 성공 콜백용) */
  readonly executeRatingAction: () => void;
  /** pending 액션 타입 조회 (로그인 성공 콜백 결정용) */
  readonly getPendingActionType: () => 'favorite' | 'rating' | null;
}

export function useContentInfoActions({
  contentId,
  contentType,
  contentTitle,
}: UseContentInfoActionsParams): UseContentInfoActionsReturn {
  // 인증 상태
  const { status } = useAuth();
  const isLoggedIn = status === 'authenticated';

  // 찜 상태 및 토글
  const { data: favoriteStatus } = useFavoriteStatus(contentId, contentType);
  const { mutate: toggleFavorite } = useToggleFavorite();
  const isFavorited = favoriteStatus?.isFavorited ?? false;

  // 평점 상태 및 등록
  const { data: ratingStatus } = useRatingStatus(contentId, contentType);
  const { mutate: setRating } = useSetRating();
  const hasRating = ratingStatus?.hasRating ?? false;
  const currentRating = ratingStatus?.rating ?? null;

  // Pending 액션 상태 (Zustand)
  const pendingFavorite = usePendingFavoriteAction();
  const pendingRating = usePendingRatingAction();
  const { setFavoriteAction, clearFavoriteAction, setRatingAction, clearRatingAction } =
    usePendingActionActions();

  // 로그인 다이얼로그 상태
  const [isLoginDialogVisible, setLoginDialogVisible] = useState(false);

  // 평점 바텀시트 상태
  const [isRatingSheetVisible, setRatingSheetVisible] = useState(false);

  // 로그인 상태 변화 감지 - "다른 방법으로 로그인" 후 돌아왔을 때 pending 액션 실행
  useEffect(() => {
    if (!isLoggedIn) return;

    // 찜 pending 액션 처리
    if (pendingFavorite && pendingFavorite.contentId === contentId) {
      clearFavoriteAction();
      toggleFavorite({
        contentId: pendingFavorite.contentId,
        contentType: pendingFavorite.contentType,
      });
    }

    // 평점 pending 액션 처리 (바텀시트 열기)
    if (pendingRating && pendingRating.contentId === contentId) {
      clearRatingAction();
      setRatingSheetVisible(true);
    }
  }, [
    isLoggedIn,
    contentId,
    pendingFavorite,
    pendingRating,
    toggleFavorite,
    clearFavoriteAction,
    clearRatingAction,
  ]);

  // 찜 토글 실행 함수 (카카오 로그인 성공 시 콜백)
  const executeFavoriteToggle = useCallback(() => {
    clearFavoriteAction();
    toggleFavorite({ contentId, contentType });
  }, [contentId, contentType, toggleFavorite, clearFavoriteAction]);

  // 찜 버튼 클릭 핸들러
  const handleFavoritePress = useCallback(() => {
    if (!isLoggedIn) {
      setFavoriteAction({ contentId, contentType });
      setLoginDialogVisible(true);
      return;
    }
    toggleFavorite({ contentId, contentType });
  }, [isLoggedIn, contentId, contentType, toggleFavorite, setFavoriteAction]);

  // 평점 버튼 클릭 핸들러
  const handleRatingPress = useCallback(() => {
    if (!isLoggedIn) {
      setRatingAction({ contentId, contentType, contentTitle });
      setLoginDialogVisible(true);
      return;
    }
    setRatingSheetVisible(true);
  }, [isLoggedIn, contentId, contentType, contentTitle, setRatingAction]);

  // 평점 등록 핸들러
  const handleSubmitRating = useCallback(
    (rating: number) => {
      setRating({ contentId, contentType, rating });
    },
    [contentId, contentType, setRating],
  );

  // 평점 바텀시트 닫기
  const handleCloseRatingSheet = useCallback(() => {
    setRatingSheetVisible(false);
  }, []);

  // 평점 등록 실행 함수 (카카오 로그인 성공 시 콜백)
  const executeRatingAction = useCallback(() => {
    clearRatingAction();
    setRatingSheetVisible(true);
  }, [clearRatingAction]);

  // 로그인 다이얼로그 닫기
  const handleCloseDialog = useCallback(() => {
    setLoginDialogVisible(false);
  }, []);

  // pending 액션 타입 조회 (로그인 성공 콜백 결정용)
  const getPendingActionType = useCallback((): 'favorite' | 'rating' | null => {
    if (getPendingFavoriteAction()) return 'favorite';
    if (pendingRating) return 'rating';
    return null;
  }, [pendingRating]);

  return {
    isFavorited,
    hasRating,
    currentRating,
    isLoginDialogVisible,
    isRatingSheetVisible,
    handleFavoritePress,
    handleRatingPress,
    handleSubmitRating,
    handleCloseRatingSheet,
    handleCloseDialog,
    executeFavoriteToggle,
    executeRatingAction,
    getPendingActionType,
  };
}

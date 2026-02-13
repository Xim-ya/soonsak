/**
 * pendingActionStore - 로그인 후 실행할 pending 액션 관리
 *
 * 비로그인 상태에서 로그인이 필요한 액션(찜 토글, 평점 등)을 시도할 때,
 * 로그인 완료 후 해당 액션을 실행하기 위해 저장합니다.
 *
 * Zustand store로 구현하여 React 상태 관리 패턴을 따르고,
 * 테스트 가능하고 예측 가능한 상태 관리를 제공합니다.
 */

import { create } from 'zustand';
import { useShallow } from 'zustand/react/shallow';
import type { ContentType } from '@/presentation/types/content/contentType.enum';

/** 찜 액션 타입 */
export interface PendingFavoriteAction {
  contentId: number;
  contentType: ContentType;
}

/** 평점 액션 타입 */
export interface PendingRatingAction {
  contentId: number;
  contentType: ContentType;
  contentTitle: string;
}

/** Pending 액션 상태 타입 */
interface PendingActionState {
  favoriteAction: PendingFavoriteAction | null;
  ratingAction: PendingRatingAction | null;
}

/** Pending 액션 액션 타입 */
interface PendingActionActions {
  setFavoriteAction: (action: PendingFavoriteAction) => void;
  clearFavoriteAction: () => void;
  setRatingAction: (action: PendingRatingAction) => void;
  clearRatingAction: () => void;
  clearAllActions: () => void;
}

/** Zustand Store */
export const usePendingActionStore = create<PendingActionState & PendingActionActions>((set) => ({
  // State
  favoriteAction: null,
  ratingAction: null,

  // Actions
  setFavoriteAction: (action) => set({ favoriteAction: action }),
  clearFavoriteAction: () => set({ favoriteAction: null }),
  setRatingAction: (action) => set({ ratingAction: action }),
  clearRatingAction: () => set({ ratingAction: null }),
  clearAllActions: () => set({ favoriteAction: null, ratingAction: null }),
}));

/**
 * Selector Hooks - 필요한 상태만 구독하여 불필요한 리렌더링 방지
 */
export const usePendingFavoriteAction = () =>
  usePendingActionStore((state) => state.favoriteAction);

export const usePendingRatingAction = () => usePendingActionStore((state) => state.ratingAction);

/**
 * Action Hooks - 액션 함수만 반환
 * useShallow로 shallow equality 적용하여 무한 루프 방지
 */
export const usePendingActionActions = () =>
  usePendingActionStore(
    useShallow((state) => ({
      setFavoriteAction: state.setFavoriteAction,
      clearFavoriteAction: state.clearFavoriteAction,
      setRatingAction: state.setRatingAction,
      clearRatingAction: state.clearRatingAction,
      clearAllActions: state.clearAllActions,
    })),
  );

/**
 * 비-React 환경에서 사용할 수 있는 유틸리티 함수들
 * (기존 인터페이스 호환성 유지)
 */
export const setPendingFavoriteAction = (action: PendingFavoriteAction): void => {
  usePendingActionStore.getState().setFavoriteAction(action);
};

export const getPendingFavoriteAction = (): PendingFavoriteAction | null => {
  return usePendingActionStore.getState().favoriteAction;
};

export const clearPendingFavoriteAction = (): void => {
  usePendingActionStore.getState().clearFavoriteAction();
};

export const setPendingRatingAction = (action: PendingRatingAction): void => {
  usePendingActionStore.getState().setRatingAction(action);
};

export const getPendingRatingAction = (): PendingRatingAction | null => {
  return usePendingActionStore.getState().ratingAction;
};

export const clearPendingRatingAction = (): void => {
  usePendingActionStore.getState().clearRatingAction();
};

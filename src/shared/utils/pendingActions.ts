/**
 * @deprecated
 * 이 파일은 하위 호환성을 위해 유지됩니다.
 * 새로운 코드에서는 '@/shared/stores/pendingActionStore'를 직접 사용하세요.
 *
 * React 컴포넌트에서는 hook 기반 API를 사용하세요:
 * - usePendingFavoriteAction()
 * - usePendingRatingAction()
 * - usePendingActionActions()
 */

export {
  // Types
  type PendingFavoriteAction,
  type PendingRatingAction,

  // Zustand Store (for advanced usage)
  usePendingActionStore,

  // Selector Hooks (recommended for React components)
  usePendingFavoriteAction,
  usePendingRatingAction,
  usePendingActionActions,

  // Legacy utility functions (for non-React code or backward compatibility)
  setPendingFavoriteAction,
  getPendingFavoriteAction,
  clearPendingFavoriteAction,
  setPendingRatingAction,
  getPendingRatingAction,
  clearPendingRatingAction,
} from '@/shared/stores/pendingActionStore';

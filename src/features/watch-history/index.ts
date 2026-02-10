/**
 * Watch History Feature
 *
 * 사용자 시청 기록 관리 기능을 제공합니다.
 * - 시청 기록 추가/삭제
 * - 캘린더용 월별 시청 기록 조회
 * - 시청 기록 목록 조회
 */

// API
export { watchHistoryApi } from './api/watchHistoryApi';

// Hooks
export {
  useWatchHistoryCalendar,
  useWatchHistoryList,
  useUniqueWatchHistory,
  useAddWatchHistory,
  useDeleteWatchHistory,
  useClearAllWatchHistory,
} from './hooks/useWatchHistory';

// Types
export type {
  WatchHistoryDto,
  WatchHistoryWithContentDto,
  WatchHistoryCalendarItemDto,
  MonthlyWatchSummaryDto,
  CreateWatchHistoryParams,
} from './types';

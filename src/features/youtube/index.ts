/**
 * YouTube Feature 모듈 통합 Export
 *
 * 이 모듈은 YouTube 관련 모든 기능을 제공합니다:
 * - API: YouTube 데이터 가져오기
 * - Hooks: React Query 기반 상태 관리
 * - Types: TypeScript 타입 정의
 * - Utils: 유틸리티 함수들
 */

// API Layer
export * from './api';

// React Hooks
export * from './hooks';

// Types
export * from './types';

// Utilities
export * from './utils';

// 주요 API와 Hooks를 명시적으로 re-export (편의성)
export { youtubeApi } from './api/youtubeApi';
export {
  useYouTubeVideo,
  useYouTubeQuickInfo,
  useProgressiveYouTubeVideo,
  useMultipleYouTubeVideos,
} from './hooks/useYouTubeVideo';
export {
  useYouTubeMetrics,
  useRealTimeYouTubeMetrics,
  useFormattedMetrics,
} from './hooks/useYouTubeMetrics';

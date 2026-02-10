import type { ContentType } from '@/presentation/types/content/contentType.enum';

/**
 * ISO 8601 형식의 타임스탬프 문자열 타입
 */
type ISOTimestamp = string;

/**
 * ISO 8601 형식의 날짜 문자열 타입 (YYYY-MM-DD)
 */
type ISODate = string;

/**
 * 시청 기록 DTO
 * watch_history 테이블과 1대1 대응
 */
interface WatchHistoryDto {
  readonly id: string;
  readonly userId: string;
  readonly contentId: number;
  readonly contentType: ContentType;
  readonly videoId: string;
  readonly watchedAt: ISOTimestamp;
  readonly watchedDate: ISODate;
  readonly createdAt: ISOTimestamp;
}

/**
 * 시청 기록 + 콘텐츠 정보 조인 DTO
 * 캘린더 및 시청 기록 목록에서 포스터 이미지를 표시할 때 사용
 */
interface WatchHistoryWithContentDto extends WatchHistoryDto {
  readonly contentTitle: string;
  readonly contentPosterPath: string;
}

/**
 * 캘린더용 날짜별 시청 기록 집계 DTO
 */
interface WatchHistoryCalendarItemDto {
  readonly watchedDate: ISODate;
  readonly count: number;
  readonly firstPosterPath: string;
  readonly contentIds: number[];
}

/**
 * 월별 시청 기록 요약 DTO
 */
interface MonthlyWatchSummaryDto {
  readonly year: number;
  readonly month: number;
  readonly totalCount: number;
  readonly uniqueContents: number;
}

/**
 * 시청 기록 생성 파라미터
 */
interface CreateWatchHistoryParams {
  readonly contentId: number;
  readonly contentType: ContentType;
  readonly videoId: string;
}

export type {
  ISOTimestamp,
  ISODate,
  WatchHistoryDto,
  WatchHistoryWithContentDto,
  WatchHistoryCalendarItemDto,
  MonthlyWatchSummaryDto,
  CreateWatchHistoryParams,
};

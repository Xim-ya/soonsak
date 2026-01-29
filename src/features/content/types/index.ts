import { ContentType } from '@/presentation/types/content/contentType.enum';

/**
 * ISO 8601 형식의 타임스탬프 문자열 타입
 * Supabase에서 반환되는 timestamp 컬럼의 타입
 * @example '2024-01-15T12:30:00.000Z'
 */
type ISOTimestamp = string;

/**
 * 'contents' 테이블 컬럼과 1대1 대응이 되는 데이터 클래스
 */
interface ContentDto {
  readonly id: number;
  readonly title: string;
  readonly posterPath: string;
  readonly contentType: ContentType;
  readonly uploadedAt?: ISOTimestamp;
  readonly releaseDate?: string;
  readonly genreIds?: number[];
  readonly backdropPath?: string;
}

/**
 * 콘텐츠와 연결된 비디오 정보를 포함하는 DTO
 * Content + Video 조인 RPC 결과에 사용
 */
interface ContentWithVideoDto extends ContentDto {
  readonly runtime: number;
  readonly videoId: string;
}

/**
 * 'videos' 테이블 컬럼과 1대1 대응이 되는 데이터 클래스
 */
interface VideoDto {
  readonly id: string;
  readonly contentId: number;
  readonly contentType?: ContentType;
  readonly title: string;
  readonly runtime?: number;
  readonly thumbnailUrl?: string;
  readonly isPrimary: boolean;
  readonly channelId?: string;
  readonly includesEnding: boolean;
  readonly uploadedAt: ISOTimestamp;
  readonly updatedAt: ISOTimestamp;
}

/**
 * 비디오와 연결된 콘텐츠 정보를 포함하는 DTO
 * 채널 상세 화면에서 포스터 이미지와 콘텐츠 제목을 표시할 때 사용
 */
interface VideoWithContentDto extends VideoDto {
  readonly contentTitle: string;
  readonly contentPosterPath: string;
}

export type { ISOTimestamp, ContentDto, ContentWithVideoDto, VideoDto, VideoWithContentDto };

import { BaseContentModel } from '@/presentation/types/content/baseContentModel';
import { ContentType } from '@/presentation/types/content/contentType.enum';
import { Timestamp } from 'react-native-reanimated/lib/typescript/commonTypes';

/**
 * 'contents' 테이블 컬럼과 1대1 대응이 되는 데이터 클래스
 */
interface ContentDto {
  readonly id: number;
  readonly contentType: ContentType;
  readonly title: string;
  readonly posterPath: string;
  readonly uploadedAt: Timestamp;
  readonly releaseDate?: string;
  readonly genreIds?: number[];
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
  readonly uploadedAt: Timestamp;
  readonly updatedAt: Timestamp;
}

export { ContentDto, VideoDto };

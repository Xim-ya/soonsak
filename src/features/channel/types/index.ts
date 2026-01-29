import { ISOTimestamp } from '@/features/content/types';

/**
 * 'channels' 테이블 Row와 1:1 대응되는 DTO
 * Supabase에서 조회된 원본 데이터 구조
 */
interface ChannelDto {
  readonly id: string;
  readonly name: string | null;
  readonly handleId: string | null;
  readonly logoUrl: string | null;
  readonly bannerUrl: string | null;
  readonly subscriberCount: number | null;
  readonly isActive: boolean;
  readonly totalVideosScraped: number;
  readonly lastSyncedAt: ISOTimestamp | null;
  readonly createdAt: ISOTimestamp;
  readonly updatedAt: ISOTimestamp;
}

export type { ChannelDto };

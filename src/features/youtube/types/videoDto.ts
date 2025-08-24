/**
 * YouTube 비디오 관련 DTO 타입 정의
 */

// 메인 비디오 DTO (실제 사용하는 데이터만)
export interface YouTubeVideoDto {
  id: string;
  title: string;
  channelName: string;
  description?: string;
  thumbnails?: {
    default: string;
    high?: string;
    maxres?: string;
  };
  metrics: {
    viewCount: number;
    likeCount: number;
    likeText?: string; // "3천", "1.5만" 같은 축약된 텍스트
  };
  metadata: {
    duration: string; // "10:30" 형식
    uploadDate: string; // ISO 8601 형식
    embedHtml?: string;
  };
}

// 호환성을 위한 별칭 타입들
export type YouTubeThumbnailsDto = YouTubeVideoDto['thumbnails'];
export type YouTubeMetricsDto = YouTubeVideoDto['metrics'];
export type YouTubeMetadataDto = YouTubeVideoDto['metadata'];

// 스크래핑된 비디오 DTO (실제 추출하는 데이터만)
export interface ScrapedVideoDto {
  viewCount: number;
  likeCount: number;
  likeText?: string;
  uploadDate: string;
  duration: string;
  description?: string;
  channelName?: string;
}

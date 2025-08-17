/**
 * YouTube 비디오 관련 타입 정의
 */

// 메인 비디오 타입 (실제 사용하는 데이터만)
export interface YouTubeVideo {
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
export type YouTubeThumbnails = YouTubeVideo['thumbnails'];
export type YouTubeMetrics = YouTubeVideo['metrics'];
export type YouTubeMetadata = YouTubeVideo['metadata'];

// oEmbed 응답 타입
export interface OEmbedResponse {
  title: string;
  author_name: string;
  author_url: string;
  type: string;
  height: number;
  width: number;
  version: string;
  provider_name: string;
  provider_url: string;
  thumbnail_height: number;
  thumbnail_width: number;
  thumbnail_url: string;
  html: string;
}

// 스크래핑된 데이터 타입 (실제 추출하는 데이터만)
export interface ScrapedVideoData {
  viewCount: number;
  likeCount: number;
  likeText?: string;
  uploadDate: string;
  duration: string;
  description?: string;
  channelName?: string;
}

// 에러 타입
export class YouTubeApiError extends Error {
  constructor(
    message: string,
    public code: YouTubeErrorCode,
    public retry: boolean = false,
  ) {
    super(message);
    this.name = 'YouTubeApiError';
  }
}

export enum YouTubeErrorCode {
  VIDEO_NOT_FOUND = 'VIDEO_NOT_FOUND',
  INVALID_URL = 'INVALID_URL',
  API_ERROR = 'API_ERROR',
  NETWORK_ERROR = 'NETWORK_ERROR',
  PARSING_ERROR = 'PARSING_ERROR',
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
}


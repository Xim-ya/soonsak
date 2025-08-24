/**
 * YouTube 공통 타입 정의
 */

// oEmbed 응답 DTO
export interface OEmbedDto {
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
  CHANNEL_NOT_FOUND = 'CHANNEL_NOT_FOUND',
  INVALID_URL = 'INVALID_URL',
  API_ERROR = 'API_ERROR',
  NETWORK_ERROR = 'NETWORK_ERROR',
  PARSING_ERROR = 'PARSING_ERROR',
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
}

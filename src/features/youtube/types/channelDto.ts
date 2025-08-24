/**
 * YouTube 채널 관련 DTO 타입 정의
 */

// YouTube 채널 DTO (API 응답용)
export interface YouTubeChannelDto {
  id: string; // 채널 ID (@01nam 같은 핸들)
  name: string;
  description: string;
  subscriberCount: number;
  subscriberText?: string; // "15만명" 같은 축약된 텍스트
  images: {
    avatar: string; // 채널 로고 이미지
    banner?: string; // 채널 배경 이미지
  };
  metadata: {
    videoCount?: number;
    joinDate?: string; // 채널 생성일
  };
}

// 스크래핑된 채널 DTO (내부 처리용)
export interface ScrapedChannelDto {
  name: string;
  description: string;
  subscriberCount: number;
  subscriberText?: string;
  avatarUrl: string;
  bannerUrl?: string;
  videoCount?: number;
}

/**
 * YouTube URL 파싱 유틸리티
 */

/**
 * YouTube URL에서 비디오 ID 추출
 * @param url YouTube URL 또는 비디오 ID
 * @returns 비디오 ID 또는 null
 */
export const extractVideoId = (url: string): string | null => {
  if (!url) return null;

  // 이미 비디오 ID인 경우 (11자리 영숫자)
  if (/^[a-zA-Z0-9_-]{11}$/.test(url)) {
    return url;
  }

  // 다양한 YouTube URL 패턴
  const patterns = [
    // youtube.com/watch?v=VIDEO_ID
    /(?:youtube\.com\/watch\?v=|youtube\.com\/watch\?.*&v=)([^&\n?#]+)/,
    // youtu.be/VIDEO_ID
    /(?:youtu\.be\/)([^&\n?#]+)/,
    // youtube.com/embed/VIDEO_ID
    /(?:youtube\.com\/embed\/)([^&\n?#]+)/,
    // youtube.com/v/VIDEO_ID
    /(?:youtube\.com\/v\/)([^&\n?#]+)/,
    // youtube.com/shorts/VIDEO_ID
    /(?:youtube\.com\/shorts\/)([^&\n?#]+)/,
    // m.youtube.com/watch?v=VIDEO_ID
    /(?:m\.youtube\.com\/watch\?v=)([^&\n?#]+)/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }

  return null;
};

/**
 * 비디오 ID를 YouTube URL로 변환
 * @param videoId 비디오 ID
 * @returns YouTube watch URL
 */
export const buildYouTubeUrl = (videoId: string): string => {
  return `https://www.youtube.com/watch?v=${videoId}`;
};

/**
 * YouTube embed URL 생성
 * @param videoId 비디오 ID
 * @returns YouTube embed URL
 */
export const buildEmbedUrl = (videoId: string): string => {
  return `https://www.youtube.com/embed/${videoId}`;
};

/**
 * 썸네일 URL 생성
 * @param videoId 비디오 ID
 * @param quality 썸네일 품질
 * @returns 썸네일 URL
 */
export const buildThumbnailUrl = (
  videoId: string,
  quality: 'default' | 'medium' | 'high' | 'standard' | 'maxres' = 'high',
): string => {
  const qualityMap = {
    default: 'default', // 120x90
    medium: 'mqdefault', // 320x180
    high: 'hqdefault', // 480x360
    standard: 'sddefault', // 640x480
    maxres: 'maxresdefault', // 1280x720
  };

  return `https://i.ytimg.com/vi/${videoId}/${qualityMap[quality]}.jpg`;
};

/**
 * URL이 유효한 YouTube URL인지 확인
 * @param url 확인할 URL
 * @returns YouTube URL 여부
 */
export const isYouTubeUrl = (url: string): boolean => {
  return extractVideoId(url) !== null;
};

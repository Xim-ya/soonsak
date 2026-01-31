/**
 * YouTube 플레이어 에러 코드 상수
 * @see https://developers.google.com/youtube/iframe_api_reference#onError
 */

export const YOUTUBE_PLAYER_ERROR = {
  /** 요청한 비디오를 찾을 수 없음 */
  VIDEO_NOT_FOUND: 2,
  /** 요청한 비디오에서 임베드 재생이 허용되지 않음 */
  EMBED_NOT_ALLOWED: 5,
  /** 요청한 콘텐츠를 찾을 수 없음 (삭제 또는 비공개) */
  CONTENT_NOT_FOUND: 100,
  /** 채널 소유자가 임베드 재생을 제한함 */
  EMBEDDED_RESTRICTED: 150,
  /** 광고 로딩 실패 또는 임베드 검증 실패 (doubleclick.net 연결 거부 등) */
  AD_LOADING_FAILED: 152,
  /** 비디오 플레이어 설정 오류 (Referer/쿠키 문제) */
  PLAYER_CONFIG_ERROR: 153,
} as const;

export const YOUTUBE_PLAYER_ERROR_MESSAGE = {
  EMBEDDED_RESTRICTED: 'EMBEDDED_RESTRICTED',
} as const;

/**
 * 임베드 재생 제한 에러인지 확인 (에러 코드 150, 152, 153 포함)
 */
export const isEmbeddedRestrictedError = (error: { code: number; message: string }): boolean => {
  const embeddedRestrictedCodes: number[] = [
    YOUTUBE_PLAYER_ERROR.EMBEDDED_RESTRICTED,
    YOUTUBE_PLAYER_ERROR.AD_LOADING_FAILED,
    YOUTUBE_PLAYER_ERROR.PLAYER_CONFIG_ERROR,
  ];
  return embeddedRestrictedCodes.includes(error.code);
};

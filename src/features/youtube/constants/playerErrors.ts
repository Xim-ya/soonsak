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
} as const;

export const YOUTUBE_PLAYER_ERROR_MESSAGE = {
  EMBEDDED_RESTRICTED: 'EMBEDDED_RESTRICTED',
} as const;

/**
 * 임베드 재생 제한 에러인지 확인
 */
export const isEmbeddedRestrictedError = (error: { code: number; message: string }): boolean => {
  return (
    error.code === YOUTUBE_PLAYER_ERROR.EMBEDDED_RESTRICTED &&
    error.message === YOUTUBE_PLAYER_ERROR_MESSAGE.EMBEDDED_RESTRICTED
  );
};

/**
 * User Feature 타입 정의
 *
 * 프로필 설정 관련 타입들을 정의합니다.
 */

/** 프로필 설정 모드 */
export type ProfileSetupMode = 'initial' | 'edit';

/** 프로필 설정 페이지 파라미터 */
export interface ProfileSetupParams {
  readonly mode: ProfileSetupMode;
}

/** 프로필 업데이트 요청 DTO */
export interface ProfileUpdateDto {
  readonly displayName?: string | undefined;
  readonly avatarUrl?: string | undefined;
}

/** 닉네임 Validation 에러 타입 */
export type NicknameValidationError =
  | 'EMPTY'
  | 'TOO_SHORT'
  | 'TOO_LONG'
  | 'HAS_SPACE'
  | 'INVALID_CHAR'
  | 'PROFANITY'
  | 'RESERVED'
  | 'DUPLICATE';

/** 닉네임 Validation 결과 */
export interface NicknameValidationResult {
  readonly isValid: boolean;
  readonly error: NicknameValidationError | null;
  readonly errorMessage: string | null;
}

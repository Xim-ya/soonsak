import type { User, Session } from '@supabase/supabase-js';
import type { AuthErrorCode } from '../constants/authErrors';

/** 소셜 로그인 프로바이더 타입 */
export type SocialProvider = 'google' | 'apple' | 'kakao';

/** OAuth 지원 프로바이더 (Apple 제외) */
export type OAuthProvider = Exclude<SocialProvider, 'apple'>;

/** 인증 상태 */
export type AuthStatus = 'idle' | 'authenticated' | 'unauthenticated';

/** 프로필 DTO */
export interface ProfileDto {
  id: string;
  email: string | null;
  displayName: string | null;
  avatarUrl: string | null;
  provider: string | null;
  createdAt: string;
  updatedAt: string;
  lastLoginAt: string | null;
}

/** 인증 결과 DTO */
export interface AuthResultDto {
  user: User | null;
  session: Session | null;
}

/** 인증 에러 DTO */
export interface AuthErrorDto {
  code: AuthErrorCode;
  message: string;
  provider?: SocialProvider;
}

/** AuthContext 상태 타입 */
export interface AuthState {
  status: AuthStatus;
  user: User | null;
  session: Session | null;
}

/** 유저 프로필 Model (User DTO에서 UI용으로 파생) */
export interface UserProfileModel {
  displayName: string;
  avatarUrl: string | undefined;
}

/** AuthContext 값 타입 */
export interface AuthContextValue extends AuthState, UserProfileModel {
  signOut: () => Promise<void>;
}

import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react';
import type { User } from '@supabase/supabase-js';
import { authApi } from '@/features/auth/api/authApi';
import type { AuthState, AuthContextValue, UserProfileModel } from '@/features/auth/types';

/** 초기 인증 상태 */
const initialState: AuthState = {
  status: 'idle',
  user: null,
  session: null,
};

const DEFAULT_DISPLAY_NAME = '사용자';

/**
 * 유저 프로필 Model 파생
 * - User DTO(SDK)에서 UI용 Model로 변환
 * - 저렴한 계산이므로 useMemo 불필요 (Kent C. Dodds 가이드라인)
 */
function deriveUserProfile(user: User | null): UserProfileModel {
  if (!user) {
    return { displayName: DEFAULT_DISPLAY_NAME, avatarUrl: undefined };
  }

  const metadata = user.user_metadata;

  // displayName: name > email prefix > 기본값
  const name = metadata?.['name'];
  const displayName =
    typeof name === 'string' && name.length > 0
      ? name
      : (user.email?.split('@')[0] ?? DEFAULT_DISPLAY_NAME);

  // avatarUrl: 있으면 사용, 없으면 undefined
  const avatarUrl =
    typeof metadata?.['avatar_url'] === 'string' ? metadata['avatar_url'] : undefined;

  return { displayName, avatarUrl };
}

/** AuthContext 생성 */
const AuthContext = createContext<AuthContextValue | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

/**
 * AuthProvider - 전역 인증 상태 관리
 *
 * Supabase Auth의 세션 상태를 실시간으로 감지하고 관리합니다.
 * - 앱 시작 시 저장된 세션 복원
 * - 로그인/로그아웃 이벤트 자동 감지
 * - useAuth() 훅을 통한 인증 상태 접근
 *
 * @example
 * // App.tsx에서 사용
 * <AuthProvider>
 *   <AppContent />
 * </AuthProvider>
 *
 * // 하위 컴포넌트에서 사용
 * const { status, user, signOut } = useAuth();
 */
export function AuthProvider({ children }: AuthProviderProps) {
  const [state, setState] = useState<AuthState>(initialState);

  // 로그아웃 핸들러
  const signOut = useCallback(async () => {
    await authApi.signOut();
    // 상태는 onAuthStateChange에서 자동 업데이트됨
  }, []);

  // 초기 세션 복원 및 상태 변경 구독
  useEffect(() => {
    let mounted = true;

    // 초기 세션 복원
    const restoreSession = async () => {
      const session = await authApi.getSession();

      if (mounted) {
        if (session) {
          setState({
            status: 'authenticated',
            user: session.user,
            session,
          });
        } else {
          setState({
            status: 'unauthenticated',
            user: null,
            session: null,
          });
        }
      }
    };

    restoreSession();

    // 인증 상태 변경 구독
    const { unsubscribe } = authApi.onAuthStateChange((event, session) => {
      if (!mounted) return;

      if (event === 'SIGNED_IN' && session) {
        setState({
          status: 'authenticated',
          user: session.user,
          session,
        });
      } else if (event === 'SIGNED_OUT') {
        setState({
          status: 'unauthenticated',
          user: null,
          session: null,
        });
      } else if (event === 'TOKEN_REFRESHED' && session) {
        setState((prev) => ({
          ...prev,
          session,
        }));
      }
    });

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, []);

  // User DTO → UserProfileModel 변환
  const profile = deriveUserProfile(state.user);

  const value: AuthContextValue = {
    ...state,
    ...profile,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * useAuth - 인증 상태 접근 훅
 *
 * AuthProvider 내에서만 사용 가능합니다.
 *
 * @returns AuthContextValue
 * - status: 'idle' | 'authenticated' | 'unauthenticated'
 * - user: Supabase User 객체
 * - session: Supabase Session 객체
 * - displayName: 표시용 사용자 이름 (name > email prefix > '사용자')
 * - avatarUrl: 프로필 이미지 URL
 * - signOut: 로그아웃 함수
 *
 * @example
 * const { status, displayName, avatarUrl, signOut } = useAuth();
 *
 * if (status === 'authenticated') {
 *   console.log('로그인됨:', displayName);
 * }
 */
export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}

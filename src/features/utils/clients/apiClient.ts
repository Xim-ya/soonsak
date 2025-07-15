import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env['EXPO_PUBLIC_SUPABASE_URL'];
const supabaseAnonKey = process.env['EXPO_PUBLIC_SUPABASE_ANON_KEY'];

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

// 공통 Auth 설정
const authConfig = {
  storage: AsyncStorage,
  autoRefreshToken: true,
  persistSession: true,
  detectSessionInUrl: false,
};

/**
 * Content 스키마 전용 클라이언트
 * - 스키마: content
 * - 용도: content.contents 테이블 및 관련 작업
 */
const contentSupabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
  auth: authConfig,
  db: {
    schema: 'content',
  },
});

/**
 * 일반 목적용 클라이언트
 * - 스키마: public (기본값)
 * - 용도: Auth, public 테이블, 기타 일반적인 작업
 */
const generalSupabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
  auth: authConfig,
});

/**
 * 🎯 API 클라이언트 통합 관리
 */
export const apiClient = {
  /** Content 스키마 전용 (content.contents 등) */
  content: contentSupabaseClient,

  /** 일반 목적용 (Auth, public 테이블 등) */
  general: generalSupabaseClient,

  // 🔮 향후 확장 가능:
  // auth: authClient,
  // analytics: analyticsClient,
  // etc...
};

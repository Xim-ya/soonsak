/**
 * onboardingStorage - 온보딩 완료 상태 관리
 *
 * 사용자가 최초 로그인 화면을 거쳤는지 (로그인 또는 비회원 둘러보기) 저장합니다.
 * - 최초 앱 설치 시: 뒤로가기 버튼 없음
 * - 온보딩 완료 후: 뒤로가기 버튼 표시 (다른 화면에서 로그인 페이지 접근 시)
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

const ONBOARDING_COMPLETED_KEY = 'soonsak_onboarding_completed';

export const onboardingStorage = {
  /**
   * 온보딩 완료 여부 확인
   */
  isCompleted: async (): Promise<boolean> => {
    try {
      const value = await AsyncStorage.getItem(ONBOARDING_COMPLETED_KEY);
      return value === 'true';
    } catch {
      return false;
    }
  },

  /**
   * 온보딩 완료 표시
   * 로그인 성공 또는 비회원 둘러보기 선택 시 호출
   */
  markCompleted: async (): Promise<void> => {
    try {
      await AsyncStorage.setItem(ONBOARDING_COMPLETED_KEY, 'true');
    } catch {
      // 저장 실패해도 앱 동작에 영향 없음
    }
  },

  /**
   * 온보딩 상태 초기화 (테스트/디버그용)
   */
  reset: async (): Promise<void> => {
    try {
      await AsyncStorage.removeItem(ONBOARDING_COMPLETED_KEY);
    } catch {
      // 삭제 실패해도 앱 동작에 영향 없음
    }
  },
};

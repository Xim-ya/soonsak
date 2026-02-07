/**
 * sessionSeed - 앱 세션별 랜덤 시드 관리
 *
 * 앱이 시작될 때마다 새로운 시드가 생성되고,
 * 같은 세션에서는 동일한 시드를 반환합니다.
 */

let sessionSeed: number | null = null;

/**
 * 현재 세션의 랜덤 시드를 반환합니다.
 * 첫 호출 시 새로운 시드를 생성합니다.
 */
export function getSessionSeed(): number {
  if (sessionSeed === null) {
    sessionSeed = Math.random();
  }
  return sessionSeed;
}

/**
 * 세션 시드를 리셋합니다.
 * (테스트용 또는 수동 새로고침 시 사용)
 */
export function resetSessionSeed(): void {
  sessionSeed = null;
}

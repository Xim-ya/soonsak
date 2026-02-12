/**
 * 랜덤 닉네임 생성기
 *
 * "형용사 + 명사 + 숫자" 형태의 닉네임을 생성합니다.
 * 예: "활발한고양이42", "신나는판다7"
 */

/** 형용사 목록 */
const ADJECTIVES = [
  '활발한',
  '신나는',
  '귀여운',
  '멋진',
  '빛나는',
  '용감한',
  '따뜻한',
  '똑똑한',
  '재미있는',
  '행복한',
  '씩씩한',
  '사랑스런',
  '당당한',
  '유쾌한',
  '상큼한',
  '착한',
  '밝은',
  '다정한',
  '쿨한',
  '힙한',
] as const;

/** 명사 목록 (동물/캐릭터) */
const NOUNS = [
  '고양이',
  '강아지',
  '토끼',
  '여우',
  '판다',
  '다람쥐',
  '햄스터',
  '펭귄',
  '부엉이',
  '돌고래',
  '코알라',
  '수달',
  '사자',
  '호랑이',
  '곰',
  '물범',
  '참새',
  '독수리',
  '고래',
  '기린',
] as const;

/** 숫자 최대값 */
const MAX_NUMBER = 100;

/**
 * 배열에서 랜덤 요소 선택
 */
function pickRandom<T>(array: readonly T[]): T {
  const index = Math.floor(Math.random() * array.length);
  return array[index] as T;
}

/**
 * 랜덤 닉네임 생성
 *
 * "형용사명사숫자" 형태의 닉네임을 생성합니다.
 * 최대 10자를 초과하지 않도록 구성됩니다.
 *
 * @returns 생성된 닉네임 (예: "활발한고양이42")
 *
 * @example
 * const nickname = generateRandomNickname();
 * // "신나는판다7", "귀여운토끼23" 등
 */
export function generateRandomNickname(): string {
  const adjective = pickRandom(ADJECTIVES);
  const noun = pickRandom(NOUNS);
  const number = Math.floor(Math.random() * MAX_NUMBER);

  return `${adjective}${noun}${number}`;
}

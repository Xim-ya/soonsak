/**
 * 한글 초성 관련 유틸리티 함수
 *
 * 한글 유니코드 원리:
 * - 한글 범위: U+AC00 (가) ~ U+D7A3 (힣)
 * - 초성 19개, 중성 21개, 종성 28개
 * - 공식: 초성 인덱스 = (유니코드값 - 44032) / 588
 */

const CHOSUNG = [
  'ㄱ',
  'ㄲ',
  'ㄴ',
  'ㄷ',
  'ㄸ',
  'ㄹ',
  'ㅁ',
  'ㅂ',
  'ㅃ',
  'ㅅ',
  'ㅆ',
  'ㅇ',
  'ㅈ',
  'ㅉ',
  'ㅊ',
  'ㅋ',
  'ㅌ',
  'ㅍ',
  'ㅎ',
] as const;

const HANGUL_START = 44032; // '가'
const HANGUL_END = 55203; // '힣'
const CHOSUNG_INTERVAL = 588; // 21 * 28

/**
 * 문자에서 초성 추출
 */
export function getChosung(char: string): string {
  const code = char.charCodeAt(0);

  if (code >= HANGUL_START && code <= HANGUL_END) {
    const index = Math.floor((code - HANGUL_START) / CHOSUNG_INTERVAL);
    return CHOSUNG[index] ?? char;
  }

  return char;
}

/**
 * 문자열에서 초성만 추출
 */
export function extractChosung(text: string): string {
  return Array.from(text).map(getChosung).join('');
}

/**
 * 문자가 초성인지 확인
 */
export function isChosung(char: string): boolean {
  return (CHOSUNG as readonly string[]).includes(char);
}

/**
 * 쿼리가 초성만으로 이루어졌는지 확인
 */
export function isChosungOnly(query: string): boolean {
  const normalized = query.replace(/\s/g, '');
  if (normalized.length === 0) return false;
  return Array.from(normalized).every(isChosung);
}

/**
 * 검색어 정규화 (공백 제거)
 */
export function normalizeSearchQuery(query: string): string {
  return query.replace(/\s+/g, '');
}

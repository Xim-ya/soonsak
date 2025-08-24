/**
 * TMDB API 설정
 */

/**
 * TMDB API 기본 URL
 */
export const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

/**
 * TMDB API 키 (환경변수에서 가져오기)
 */
export const TMDB_API_KEY = process.env['TMDB_API_KEY'] || 'b40235ce96defc556ca26d48159f5f13';

/**
 * TMDB 이미지 기본 URL
 */
export const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/';

/**
 * 지원 언어 목록
 */
export const SUPPORTED_LANGUAGES = ['ko', 'en', 'ja', 'zh'] as const;

/**
 * 기본 언어
 */
export const DEFAULT_LANGUAGE = 'ko' as const;

export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

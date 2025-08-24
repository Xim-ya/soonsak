/**
 * TMDB Credits API 응답 타입 정의
 * TV Credits, Movie Credits에서 공통으로 사용되는 타입들
 */

// 기본 인물 정보
interface BasePerson {
  adult: boolean;
  gender: number;
  id: number;
  known_for_department: string;
  name: string;
  original_name: string;
  popularity: number;
  profile_path: string | null;
}

// Cast 공통 필드
interface BaseCast extends BasePerson {
  character: string;
  credit_id: string;
  order: number;
}

// TV Cast (cast_id 없음)
export interface TVCast extends BaseCast {}

// Movie Cast (cast_id 있음)
export interface MovieCast extends BaseCast {
  cast_id: number;
}

// Crew (TV와 Movie 동일)
export interface Crew extends BasePerson {
  credit_id: string;
  department: string;
  job: string;
}

// TV Credits 응답
export interface TVCreditsResponse {
  cast: TVCast[];
  crew: Crew[];
  id: number;
}

// Movie Credits 응답
export interface MovieCreditsResponse {
  id: number;
  cast: MovieCast[];
  crew: Crew[];
}
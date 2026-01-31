/**
 * genreConstants - TMDB 장르 상수 정의
 *
 * TMDB API의 장르 ID와 한국어 이름을 매핑합니다.
 * 콘텐츠 타입(영화/TV)에 따라 표시할 장르 목록이 다릅니다.
 */

interface GenreItem {
  readonly id: number;
  readonly name: string;
}

/**
 * TMDB 장르 ID -> 한국어 매핑
 */
const TMDB_GENRE_MAP: Record<number, string> = {
  28: '액션',
  12: '모험',
  16: '애니메이션',
  35: '코미디',
  80: '범죄',
  99: '다큐멘터리',
  18: '드라마',
  10751: '가족',
  14: '판타지',
  36: '역사',
  27: '공포',
  10402: '음악',
  9648: '미스터리',
  10749: '로맨스',
  878: 'SF',
  10770: 'TV 영화',
  53: '스릴러',
  10752: '전쟁',
  37: '서부',
  // TV 전용 장르
  10759: '액션 & 어드벤처',
  10762: '키즈',
  10763: '뉴스',
  10764: '리얼리티',
  10765: 'SF & 판타지',
  10766: '연속극',
  10767: '토크',
  10768: '전쟁 & 정치',
};

/** 영화 장르 목록 (DB 빈도순) */
const MOVIE_GENRES: readonly GenreItem[] = [
  { id: 18, name: '드라마' },
  { id: 53, name: '스릴러' },
  { id: 28, name: '액션' },
  { id: 35, name: '코미디' },
  { id: 80, name: '범죄' },
  { id: 9648, name: '미스터리' },
  { id: 10749, name: '로맨스' },
  { id: 878, name: 'SF' },
  { id: 12, name: '모험' },
  { id: 27, name: '공포' },
  { id: 36, name: '역사' },
  { id: 10752, name: '전쟁' },
  { id: 14, name: '판타지' },
  { id: 10751, name: '가족' },
  { id: 16, name: '애니메이션' },
  { id: 99, name: '다큐멘터리' },
  { id: 10402, name: '음악' },
  { id: 37, name: '서부' },
] as const;

/** TV 시리즈 장르 목록 (DB 빈도순) */
const TV_GENRES: readonly GenreItem[] = [
  { id: 18, name: '드라마' },
  { id: 10765, name: 'SF & 판타지' },
  { id: 10759, name: '액션 & 어드벤처' },
  { id: 80, name: '범죄' },
  { id: 35, name: '코미디' },
  { id: 9648, name: '미스터리' },
  { id: 16, name: '애니메이션' },
  { id: 10764, name: '리얼리티' },
  { id: 10762, name: '키즈' },
  { id: 10768, name: '전쟁 & 정치' },
] as const;

/** 전체(영화+TV) 선택 시 통합 장르 목록 (빈도순) */
const ALL_GENRES: readonly GenreItem[] = [
  { id: 18, name: '드라마' },
  { id: 53, name: '스릴러' },
  { id: 28, name: '액션' },
  { id: 35, name: '코미디' },
  { id: 80, name: '범죄' },
  { id: 9648, name: '미스터리' },
  { id: 10749, name: '로맨스' },
  { id: 878, name: 'SF' },
  { id: 12, name: '모험' },
  { id: 27, name: '공포' },
  { id: 16, name: '애니메이션' },
  { id: 36, name: '역사' },
  { id: 10752, name: '전쟁' },
  { id: 14, name: '판타지' },
  { id: 10751, name: '가족' },
  { id: 99, name: '다큐멘터리' },
  { id: 10402, name: '음악' },
  { id: 37, name: '서부' },
] as const;

/**
 * 콘텐츠 타입에 따른 장르 목록 반환
 * @param contentType 콘텐츠 타입 (null = 전체)
 */
function getGenresByContentType(contentType: string | null): readonly GenreItem[] {
  switch (contentType) {
    case 'movie':
      return MOVIE_GENRES;
    case 'tv':
      return TV_GENRES;
    default:
      return ALL_GENRES;
  }
}

export type { GenreItem };
export { TMDB_GENRE_MAP, MOVIE_GENRES, TV_GENRES, ALL_GENRES, getGenresByContentType };

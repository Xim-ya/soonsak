const formatter = {
  TMDB_IMAGE_BASE_URL: 'https://image.tmdb.org/t/p/',

  /**
   * TMDB 이미지 URL을 생성하는 유틸리티 함수
   * @param imgId 이미지 파일명
   * @param size 이미지 사이즈 (예: 'w500', 'original' 등), 기본값은 'original'
   * */
  prefixTmdbImgUrl(
    imgId: string,
    { size = TmdbImageSize.original }: { size?: TmdbImageSize } = {}
  ): string {
    if (!imgId) return '';
    return `${this.TMDB_IMAGE_BASE_URL}${size}/${imgId}`;
  },
};

export enum TmdbImageSize {
  w92 = 'w92',
  w154 = 'w154',
  w185 = 'w185',
  w342 = 'w342',
  w500 = 'w500',
  w780 = 'w780',
  original = 'original',
}

export { formatter };

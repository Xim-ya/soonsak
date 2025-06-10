const formatter = {
    TMDB_IMAGE_BASE_URL: 'https://image.tmdb.org/t/p/original/',

    /** 
     * TMDB 이미지 URL을 생성하는 유틸리티 함수 
     * */
    prefixTmdbImgUrl(imgId: string): string {
        if (!imgId) return '';
        return `${this.TMDB_IMAGE_BASE_URL}${imgId}`;
    }
}

export { formatter };
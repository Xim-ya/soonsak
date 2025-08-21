import { MovieDto } from '../types';
import { fetchWithErrorHandling } from '../utils/client/tmdbClient';
import { TMDB_BASE_URL, TMDB_API_KEY } from '../config';

export const tmdbApi = {
  /**
   * 영화 상세 정보 조회
   * @param movieId 영화 ID
   * @returns 영화 상세 정보 (한국어)
   */
  getMovieDetails: async (movieId: number): Promise<MovieDto> => {
    const url = `${TMDB_BASE_URL}/movie/${movieId}?api_key=${TMDB_API_KEY}&language=ko`;
    return fetchWithErrorHandling<MovieDto>(url);
  },
};

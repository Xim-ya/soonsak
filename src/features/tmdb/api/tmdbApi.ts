import { MovieDto } from '../types/movieDto';
import { TvSeriesDto } from '../types/tvDto';
import { TVCreditsResponse, MovieCreditsResponse } from '../types/creditDto';
import { tmdbClient } from '@/features/utils/clients/tmbClient';

export const tmdbApi = {
  /**
   * 영화 상세 정보 조회
   * @param movieId 영화 ID
   * @returns 영화 상세 정보 (한국어)
   */
  getMovieDetails: (movieId: number) => tmdbClient.get<MovieDto>(`/movie/${movieId}`),
  
  /**
   * TV 시리즈 상세 정보 조회
   * @param seriesId TV 시리즈 ID
   * @returns TV 시리즈 상세 정보 (한국어)
   */
  getTvDetails: (seriesId: number) => tmdbClient.get<TvSeriesDto>(`/tv/${seriesId}`),

  /**
   * TV 시리즈 크레딧 정보 조회
   * @param seriesId TV 시리즈 ID
   * @returns TV 시리즈 크레딧 정보 (한국어)
   */
  getTvCredits: (seriesId: number) => tmdbClient.get<TVCreditsResponse>(`/tv/${seriesId}/credits`),

  /**
   * 영화 크레딧 정보 조회
   * @param movieId 영화 ID
   * @returns 영화 크레딧 정보 (한국어)
   */
  getMovieCredits: (movieId: number) => tmdbClient.get<MovieCreditsResponse>(`/movie/${movieId}/credits`),
};

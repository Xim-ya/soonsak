import { TmdbErrorDto, TmdbApiResponse } from '../../types';

/**
 * TMDB API 에러 여부 확인
 */
const isTmdbError = (response: unknown): response is TmdbErrorDto => {
  if (!response || typeof response !== 'object' || response === null) {
    return false;
  }

  const obj = response as Record<string, unknown>;

  return (
    'success' in obj && 'status_code' in obj && 'status_message' in obj && obj['success'] === false
  );
};

/**
 * HTTP 요청 헬퍼 함수
 */
export const fetchWithErrorHandling = async <T>(url: string): Promise<T> => {
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP 오류: ${response.status} ${response.statusText}`);
    }

    const data: TmdbApiResponse<T> = await response.json();

    // TMDB API 에러 응답 확인
    if (isTmdbError(data)) {
      throw new Error(`TMDB API 오류: ${data.status_message} (코드: ${data.status_code})`);
    }

    return data as T;
  } catch (error) {
    console.error('TMDB API 요청 실패:', error);
    throw error;
  }
};

import { useQuery } from '@tanstack/react-query';
import { ContentDetailModel } from '../_types/contentDetailModel.cd';

/**
 * useContentDetail - 콘텐츠 상세 정보를 관리하는 훅
 *
 * React Query를 사용하여 캐싱과 중복 요청 방지를 자동으로 처리합니다.
 * 여러 컴포넌트에서 동시에 사용해도 한 번만 API를 호출합니다.
 *
 * @param contentId - 콘텐츠 고유 ID
 * @returns 콘텐츠 데이터, 로딩 상태, 에러 상태
 *
 * @example
 * // Header 컴포넌트에서 사용
 * const { data, isLoading, error } = useContentDetail(123);
 *
 * // VideoTabView 컴포넌트에서 사용 (캐시된 데이터 재사용)
 * const { data } = useContentDetail(123);
 */
export function useContentDetailTemp(contentId: number) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['contentDetail', contentId],
    queryFn: async (): Promise<ContentDetailModel> => {
      // Fight Club API 응답 기반 Mock 데이터
      await new Promise((resolve) => setTimeout(resolve, 300)); // 0.3초로 단축

      console.log('useContentDetail api 호출', contentId);
      return {
        id: 550,
        title: '파이트 클럽',
        type: 'movie',
        posterPath: '/uEsdm0noLfmkcVrZlyyuXp9e5I7.jpg',
        backdropPath: '/hZkgoQYus5vegHoetLkCJzb17zJ.jpg',
        releaseDate: '1999-10-15',
        genreNames: ['드라마', '스릴러'],
        overview:
          '자동차 회사의 리콜 심사관으로 일하는 주인공은 일상의 무료함과 공허함 속에서 늘 새로운 탈출을 꿈꾼다. 그는 비행기에서 자신을 비누 제조업자라고 소개하는 타일러 더든을 만난다. 집에 돌아온 주인공은 아파트가 누군가에 의해 폭파되었음을 발견하고, 타일러에게 도움을 청해 함께 생활하게 된다. 어느 날 밤 타일러는 주인공에게 자신을 때려달라고 부탁한다. 사람은 싸워봐야 진정한 자신을 알 수 있다는 것이다. 결국 이들은 매주 토요일 밤 술집 지하에서 맨주먹으로 격투를 벌이는 파이트 클럽을 결성하기에 이르는데...',
        voteAverage: 8.437,
      };
    },
  });

  return {
    data: data || null,
    isLoading,
    error: error as Error | null,
  };
}

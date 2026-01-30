import { useQuery } from '@tanstack/react-query';
import { contentApi } from '@/features/content/api/contentApi';
import { ContentCollectionModel } from '../_types/contentCollectionModel.home';

const QUERY_KEY = 'contentCollections';
const STALE_TIME_MS = 5 * 60 * 1000;

/**
 * 활성화된 콘텐츠 컬렉션 목록을 조회하는 훅
 * 레이지 로드: enabled 옵션으로 조건부 로딩 지원
 */
export function useContentCollections(enabled: boolean = true) {
  return useQuery({
    queryKey: [QUERY_KEY],
    queryFn: async (): Promise<ContentCollectionModel[]> => {
      const collections = await contentApi.getActiveContentCollections();

      // 모든 컬렉션의 콘텐츠 정보를 병렬로 조회
      const collectionsWithContents = await Promise.all(
        collections.map((collection) => contentApi.getCollectionWithContents(collection)),
      );

      return collectionsWithContents.map(ContentCollectionModel.fromDto);
    },
    staleTime: STALE_TIME_MS,
    enabled,
  });
}

import { useQuery } from '@tanstack/react-query';
import { Text } from 'react-native';
import { contentApi } from '@/features/content/api/contentApi';
import { BaseContentModel } from '@/presentation/types/content/baseContentModel';
import { SectionContentListView } from './SectionContentListView';

export function RecentContentView() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['recentContent'],
    queryFn: async (): Promise<BaseContentModel[]> => {
      const items = await contentApi.getRecentUploadedContents();

      return items.map((e) => BaseContentModel.fromContentDto(e));
    },
  });

  if (isError) {
    return <Text>Unexcpected Error Occured</Text>;
  }

  return <SectionContentListView title="최신 콘텐츠" contents={isLoading ? [] : (data ?? null)} />;
}

export default RecentContentView;

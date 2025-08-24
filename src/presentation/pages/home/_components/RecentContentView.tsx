import { useQuery } from '@tanstack/react-query';
import { Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { contentApi } from '@/features/content/api/contentApi';
import { BaseContentModel } from '@/presentation/types/content/baseContentModel';
import { SectionContentListView } from './SectionContentListView';
import { RootStackParamList } from '@/shared/navigation/types';
import { routePages } from '@/shared/navigation/constant/routePages';

export function RecentContentView() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['recentContent'],
    queryFn: async (): Promise<BaseContentModel[]> => {
      const items = await contentApi.getRecentUploadedContents();

      return items.map((e) => BaseContentModel.fromContentDto(e));
    },
  });

  const handleContentTapped = (content: BaseContentModel) => {
    navigation.navigate(routePages.contentDetail, {
      id: content.id,
      title: content.title,
      type: content.type,
    });
  };

  if (isError) {
    return <Text>최신 콘텐츠를 불러올 수 없습니다</Text>;
  }

  return (
    <SectionContentListView
      title="최신 콘텐츠"
      contents={isLoading ? [] : (data ?? null)}
      onContentTapped={handleContentTapped}
    />
  );
}

export default RecentContentView;

import colors from '@/shared/styles/colors';
import { FlatList, Text } from 'react-native';

const MOCK_DATA = [
  {
    title: 1,
    thumnailUrl: 'https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg',
    channelThumnail: 'https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg',
    channelName: 'Channel Name',
    likes: 1300,
  },
];

function OtherChannelVideoListView() {
  const ItemView = () => {
    return <Text style={{ color: colors.white }}>ItemView</Text>;
  };

  return (
    <FlatList
      data={Array.from({ length: 10 }, (_, index) => ({ id: index }))}
      renderItem={({ item }: { item: any }) => <ItemView />}
      keyExtractor={(item: any) => item.id}
    />
  );
}

export { OtherChannelVideoListView };

import { View, Text, SafeAreaView, Button } from 'react-native';
import styled from '@emotion/native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import colors from '../../../shared/styles/colors';
import { Header } from './_components/Header';
import RecentContentView from './_components/RecentContentView';
import { ScrollView } from 'react-native-gesture-handler';
import { RootStackParamList } from '../../../shared/navigation/types';
import { routePages } from '@/shared/navigation/constant/routePages';

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'MainTabs'>;

export default function HomeScreen() {
  const navigation = useNavigation<HomeScreenNavigationProp>();

  // 예시: Player 화면으로 이동하는 함수
  const navigateToPlayer = (contentId: string) => {
    navigation.navigate(routePages.contentDetail, { id: contentId });
  };

  return (
    <Container>
      <ScrollView>
        <Header />

        {/* 임시 테스트 버튼 - 나중에 제거 예정 */}
        <Button
          title="Player 화면으로 이동 (테스트)"
          onPress={() => navigateToPlayer('test-content-123')}
        />

        <RecentContentView />
      </ScrollView>
    </Container>
  );
}

const Container = styled.View({
  backgroundColor: colors.black,
  flex: 1,
});

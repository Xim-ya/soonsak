import { Text, StyleSheet, View } from 'react-native';
import { ScreenRouteProp } from '../../../shared/navigation/types';
import { routePages } from '@/shared/navigation/constant/routePages';
import { BasePage } from '../../components/page';
import { BackButtonAppBar } from '../../components/app-bar';

interface ContentDetailProps {
  route: ScreenRouteProp<typeof routePages.contentDetail>;
}

export default function ContentDetailPage({ route }: ContentDetailProps) {
  const { id } = route.params;

  return (
    <BasePage>
      <BackButtonAppBar title="콘텐츠 상세" />
      
      <View style={styles.content}>
        <Text style={styles.title}>Player Screen</Text>
        <Text style={styles.contentId}>Content ID: {id}</Text>

        {/* 여기에 실제 플레이어 컴포넌트가 들어갈 예정 */}
      </View>
    </BasePage>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  contentId: {
    fontSize: 16,
    marginBottom: 40,
    textAlign: 'center',
  },
});

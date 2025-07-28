import { Text, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ScreenRouteProp } from '../../../shared/navigation/types';
import { routePages } from '@/shared/navigation/constant/routePages';
import { BasePage } from '../../components/page';
import { BackButtonAppBar } from '../../components/app-bar';
import { Header } from './_components';
import { formatter, TmdbImageSize } from '@/shared/utils/formatter';

interface ContentDetailProps {
  route: ScreenRouteProp<typeof routePages.contentDetail>;
}

export default function ContentDetailPage({ route }: ContentDetailProps) {
  const { id } = route.params;
  const insets = useSafeAreaInsets();

  return (
    <BasePage useSafeArea={false}>
      <BackButtonAppBar
        title="콘텐츠 상세"
        position="absolute"
        top={insets.top}
        left={0}
        right={0}
        zIndex={999}
      />
      <Header />

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

import styled from '@emotion/native';
import colors from '../../../shared/styles/colors';
import { Header } from './_components/Header';
import RecentContentView from './_components/RecentContentView';
import { TopTenContentListView } from './_components/TopTenContentListView';
import { FeaturedChannelSectionView } from './_components/FeaturedChannelSectionView';
import { ScrollView } from 'react-native-gesture-handler';

export default function HomeScreen() {
  return (
    <Container>
      <ScrollView>
        <Header />
        <RecentContentView />
        <TopTenContentListView />
        <FeaturedChannelSectionView />
      </ScrollView>
    </Container>
  );
}

const Container = styled.View({
  backgroundColor: colors.black,
  flex: 1,
});

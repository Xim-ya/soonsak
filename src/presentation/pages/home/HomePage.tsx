import { useCallback, useRef, useState } from 'react';
import { NativeScrollEvent, NativeSyntheticEvent, View, LayoutChangeEvent } from 'react-native';
import styled from '@emotion/native';
import colors from '../../../shared/styles/colors';
import { Header } from './_components/Header';
import RecentContentView from './_components/RecentContentView';
import { TopTenContentListView } from './_components/TopTenContentListView';
import { FeaturedChannelSectionView } from './_components/FeaturedChannelSectionView';
import { LongRuntimeContentListView } from './_components/LongRuntimeContentListView';
import { ContentCollectionSectionView } from './_components/ContentCollectionSectionView';
import { ScrollView } from 'react-native-gesture-handler';

/** 뷰포트 진입 판단 여유값 (px) */
const VIEWPORT_THRESHOLD = 200;

export default function HomeScreen() {
  const [isCollectionVisible, setIsCollectionVisible] = useState(false);
  const [viewportHeight, setViewportHeight] = useState(0);
  const collectionYRef = useRef(0);

  const handleContainerLayout = useCallback((event: LayoutChangeEvent) => {
    setViewportHeight(event.nativeEvent.layout.height);
  }, []);

  const handleCollectionLayout = useCallback((event: LayoutChangeEvent) => {
    collectionYRef.current = event.nativeEvent.layout.y;
  }, []);

  const handleScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      if (isCollectionVisible) return;

      const scrollY = event.nativeEvent.contentOffset.y;
      const triggerPoint = collectionYRef.current - viewportHeight - VIEWPORT_THRESHOLD;

      if (scrollY >= triggerPoint && collectionYRef.current > 0) {
        setIsCollectionVisible(true);
      }
    },
    [isCollectionVisible, viewportHeight],
  );

  return (
    <Container onLayout={handleContainerLayout}>
      <ScrollView onScroll={handleScroll} scrollEventThrottle={16}>
        <Header />
        <RecentContentView />
        <TopTenContentListView />
        <FeaturedChannelSectionView />
        <LongRuntimeContentListView />
        <View onLayout={handleCollectionLayout}>
          <ContentCollectionSectionView isVisible={isCollectionVisible} />
        </View>
      </ScrollView>
    </Container>
  );
}

const Container = styled.View({
  backgroundColor: colors.black,
  flex: 1,
});

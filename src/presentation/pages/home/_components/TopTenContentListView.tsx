import React, { useCallback, useMemo } from 'react';
import { FlatList, TouchableOpacity, ListRenderItemInfo } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import styled from '@emotion/native';
import Gap from '@/presentation/components/view/Gap';
import { LoadableImageView } from '@/presentation/components/image/LoadableImageView';
import colors from '@/shared/styles/colors';
import textStyles from '@/shared/styles/textStyles';
import { RootStackParamList } from '@/shared/navigation/types';
import { routePages } from '@/shared/navigation/constant/routePages';
import { formatter, TmdbImageSize } from '@/shared/utils/formatter';
import { useRealtimeTopTen } from '../_hooks/useRealtimeTopTen';
import { TopTenContentModel } from '../_types/topTenContentModel.home';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const ITEM_WIDTH = 220;
const ITEM_HEIGHT = 140;
const CONTAINER_HEIGHT = 168;
const ITEM_SEPARATOR_WIDTH = 12;

/**
 * Top 10 아이템 컴포넌트
 */
const TopTenItem = React.memo(({ item }: { item: TopTenContentModel }) => {
  const navigation = useNavigation<NavigationProp>();

  const handlePress = useCallback(() => {
    navigation.navigate(routePages.contentDetail, {
      id: item.id,
      title: item.title,
      type: item.type,
    });
  }, [navigation, item.id, item.title, item.type]);

  const imageUrl = useMemo(
    () =>
      item.backdropPath
        ? formatter.prefixTmdbImgUrl(item.backdropPath, { size: TmdbImageSize.w780 })
        : formatter.prefixTmdbImgUrl(item.posterPath, { size: TmdbImageSize.w500 }),
    [item.backdropPath, item.posterPath],
  );

  return (
    <ItemContainer>
      <ItemTouchable onPress={handlePress} activeOpacity={0.8}>
        <ImageWrapper>
          <LoadableImageView
            source={imageUrl}
            width={ITEM_WIDTH}
            height={ITEM_HEIGHT}
            borderRadius={4}
          />
          <GradientOverlay
            colors={['transparent', 'rgba(0, 0, 0, 0.8)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
          />
          <TitleText numberOfLines={1}>{item.title}</TitleText>
        </ImageWrapper>
      </ItemTouchable>
      <RankBadge>
        <RankText>{formatter.toOrdinal(item.rank)}</RankText>
      </RankBadge>
    </ItemContainer>
  );
});

/**
 * Skeleton 아이템 컴포넌트
 */
const TopTenSkeletonItem = React.memo(() => (
  <ItemContainer>
    <SkeletonBox />
  </ItemContainer>
));

/**
 * 아이템 간격 컴포넌트 (성능 최적화를 위해 외부 정의)
 */
const ItemSeparator = React.memo(() => <Gap size={ITEM_SEPARATOR_WIDTH} />);

/**
 * FlatList getItemLayout (고정 크기 아이템 최적화)
 */
const getItemLayout = (_: unknown, index: number) => ({
  length: ITEM_WIDTH + ITEM_SEPARATOR_WIDTH,
  offset: (ITEM_WIDTH + ITEM_SEPARATOR_WIDTH) * index,
  index,
});

/** FlatList contentContainerStyle (외부 정의로 리렌더링 방지) */
const listContentStyle = { paddingLeft: 16, paddingRight: 16 };

/** Skeleton 데이터 (외부 정의로 리렌더링 방지) */
const SKELETON_DATA: null[] = Array.from({ length: 5 }, () => null);

/**
 * 실시간 Top 10 콘텐츠 슬라이더
 * Flutter Plotz의 _TopTenContentSlider UI를 참고하여 구현
 */
function TopTenContentListView() {
  const { data: topTenContents, isLoading, isError } = useRealtimeTopTen();

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<TopTenContentModel | null>) =>
      !item ? <TopTenSkeletonItem /> : <TopTenItem item={item} />,
    [],
  );

  const keyExtractor = useCallback((_: unknown, index: number) => `top-ten-${index}`, []);

  // 에러 상태는 섹션을 숨김
  if (isError) {
    return null;
  }

  // 데이터가 없으면 섹션을 숨김
  if (!isLoading && (!topTenContents || topTenContents.length === 0)) {
    return null;
  }

  return (
    <Container>
      <SectionTitle>지금 뜨고있는 인기 콘텐츠</SectionTitle>
      <Gap size={7} />
      <FlatList
        horizontal
        data={isLoading ? SKELETON_DATA : topTenContents}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        ItemSeparatorComponent={ItemSeparator}
        getItemLayout={getItemLayout}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={listContentStyle}
        initialNumToRender={5}
        maxToRenderPerBatch={5}
        windowSize={3}
      />
    </Container>
  );
}

/* Styled Components */

const Container = styled.View({
  marginTop: 40,
});

const SectionTitle = styled.Text({
  ...textStyles.title2,
  color: colors.white,
  paddingHorizontal: 16,
});

const ItemContainer = styled.View({
  width: ITEM_WIDTH,
  height: CONTAINER_HEIGHT,
  position: 'relative',
});

const ItemTouchable = styled(TouchableOpacity)({
  width: ITEM_WIDTH,
  height: ITEM_HEIGHT,
});

const ImageWrapper = styled.View({
  width: ITEM_WIDTH,
  height: ITEM_HEIGHT,
  borderRadius: 4,
  overflow: 'hidden',
  position: 'relative',
});

const GradientOverlay = styled(LinearGradient)({
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  height: 49,
});

const TitleText = styled.Text({
  ...textStyles.title3,
  color: colors.white,
  position: 'absolute',
  left: 60,
  right: 8,
  bottom: 6,
  textAlign: 'right',
});

const RankBadge = styled.View({
  position: 'absolute',
  left: -4,
  bottom: 13.5,
});

const RankText = styled.Text({
  ...textStyles.web2,
  color: colors.white,
});

const SkeletonBox = styled.View({
  width: ITEM_WIDTH,
  height: ITEM_HEIGHT,
  borderRadius: 4,
  backgroundColor: colors.gray05,
});

export { TopTenContentListView };

import React, { useCallback, useMemo } from 'react';
import { FlatList, TouchableOpacity, ListRenderItemInfo, View } from 'react-native';
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
import { useContentCollections } from '../_hooks/useContentCollections';
import {
  ContentCollectionModel,
  CollectionContentModel,
} from '../_types/contentCollectionModel.home';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface ContentCollectionSectionViewProps {
  /** 화면에 노출되었는지 여부 (레이지 로드 트리거) */
  isVisible: boolean;
}

const ITEM_WIDTH = 220;
const ITEM_HEIGHT = 140;
const ITEM_SEPARATOR_WIDTH = 12;
const SECTION_MARGIN_TOP = 40;

/**
 * 컬렉션 콘텐츠 아이템 컴포넌트
 */
const CollectionContentItem = React.memo(({ item }: { item: CollectionContentModel }) => {
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
  );
});

/**
 * Skeleton 아이템 컴포넌트
 */
const SkeletonItem = React.memo(() => <SkeletonBox />);

/**
 * 아이템 간격 컴포넌트
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

const listContentStyle = { paddingLeft: 16, paddingRight: 16 };

const SKELETON_DATA: null[] = Array.from({ length: 5 }, () => null);

/**
 * 단일 컬렉션 섹션 컴포넌트
 */
const CollectionSection = React.memo(
  ({ collection, isLoading }: { collection?: ContentCollectionModel; isLoading: boolean }) => {
    const renderItem = useCallback(
      ({ item }: ListRenderItemInfo<CollectionContentModel | null>) =>
        !item ? <SkeletonItem /> : <CollectionContentItem item={item} />,
      [],
    );

    const keyExtractor = useCallback(
      (_: unknown, index: number) => `collection-item-${collection?.id ?? 'skeleton'}-${index}`,
      [collection?.id],
    );

    if (!isLoading && (!collection || collection.contents.length === 0)) {
      return null;
    }

    return (
      <SectionContainer>
        {isLoading ? <TitleSkeleton /> : <SectionTitle>{collection?.title}</SectionTitle>}
        <Gap size={7} />
        <FlatList
          horizontal
          data={isLoading ? SKELETON_DATA : collection?.contents}
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
      </SectionContainer>
    );
  },
);

/**
 * 콘텐츠 컬렉션 섹션 뷰
 * 여러 큐레이션 컬렉션을 순차적으로 표시
 * 레이지 로드: isVisible이 true가 되면 데이터 로드 시작
 */
function ContentCollectionSectionView({ isVisible }: ContentCollectionSectionViewProps) {
  const { data: collections, isLoading, isError } = useContentCollections(isVisible);

  // 아직 화면에 노출되지 않음
  if (!isVisible) {
    return null;
  }

  if (isError) {
    return null;
  }

  // 로딩 중일 때 스켈레톤 2개 표시
  if (isLoading) {
    return (
      <View>
        <CollectionSection isLoading />
        <CollectionSection isLoading />
      </View>
    );
  }

  if (!collections || collections.length === 0) {
    return null;
  }

  return (
    <View>
      {collections.map((collection) => (
        <CollectionSection key={collection.id} collection={collection} isLoading={false} />
      ))}
    </View>
  );
}

/* Styled Components */

const SectionContainer = styled.View({
  marginTop: SECTION_MARGIN_TOP,
});

const SectionTitle = styled.Text({
  ...textStyles.title2,
  color: colors.white,
  paddingHorizontal: 16,
});

const TitleSkeleton = styled.View({
  width: 180,
  height: 22,
  borderRadius: 4,
  backgroundColor: colors.gray05,
  marginLeft: 16,
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
  left: 8,
  right: 8,
  bottom: 6,
  textAlign: 'right',
});

const SkeletonBox = styled.View({
  width: ITEM_WIDTH,
  height: ITEM_HEIGHT,
  borderRadius: 4,
  backgroundColor: colors.gray05,
});

export { ContentCollectionSectionView };

import React, { useCallback, useMemo } from 'react';
import { FlatList, TouchableOpacity, ListRenderItemInfo } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import styled from '@emotion/native';
import Gap from '@/presentation/components/view/Gap';
import { LoadableImageView } from '@/presentation/components/image/LoadableImageView';
import DarkChip from '@/presentation/components/chip/DarkChip';
import colors from '@/shared/styles/colors';
import textStyles from '@/shared/styles/textStyles';
import { RootStackParamList } from '@/shared/navigation/types';
import { routePages } from '@/shared/navigation/constant/routePages';
import { formatter, TmdbImageSize } from '@/shared/utils/formatter';
import { useLongRuntimeContents } from '../_hooks/useLongRuntimeContents';
import { LongRuntimeContentModel } from '../_types/longRuntimeContentModel.home';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const ITEM_WIDTH = 220;
const ITEM_HEIGHT = 140;
const ITEM_SEPARATOR_WIDTH = 12;

/**
 * 러닝타임 긴 콘텐츠 아이템 컴포넌트
 */
const LongRuntimeItem = React.memo(({ item }: { item: LongRuntimeContentModel }) => {
  const navigation = useNavigation<NavigationProp>();

  const handlePress = useCallback(() => {
    navigation.navigate(routePages.contentDetail, {
      id: item.id,
      title: item.title,
      type: item.contentType,
    });
  }, [navigation, item.id, item.title, item.contentType]);

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
        <RuntimeChipWrapper>
          <DarkChip content={item.formattedRuntime} />
        </RuntimeChipWrapper>
        <TitleText numberOfLines={1}>{item.title}</TitleText>
      </ImageWrapper>
    </ItemTouchable>
  );
});

/**
 * Skeleton 아이템 컴포넌트
 */
const LongRuntimeSkeletonItem = React.memo(() => <SkeletonBox />);

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
 * 러닝타임이 긴 콘텐츠 슬라이더
 * TopTenContentListView 패턴 기반
 */
function LongRuntimeContentListView() {
  const { data: contents, isLoading, isError } = useLongRuntimeContents();

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<LongRuntimeContentModel | null>) =>
      !item ? <LongRuntimeSkeletonItem /> : <LongRuntimeItem item={item} />,
    [],
  );

  const keyExtractor = useCallback((_: unknown, index: number) => `long-runtime-${index}`, []);

  if (isError) {
    return null;
  }

  if (!isLoading && (!contents || contents.length === 0)) {
    return null;
  }

  return (
    <Container>
      <SectionTitle>러닝타임이 긴 콘텐츠</SectionTitle>
      <Gap size={7} />
      <FlatList
        horizontal
        data={isLoading ? SKELETON_DATA : contents}
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

const RuntimeChipWrapper = styled.View({
  position: 'absolute',
  left: 8,
  bottom: 8,
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

const SkeletonBox = styled.View({
  width: ITEM_WIDTH,
  height: ITEM_HEIGHT,
  borderRadius: 4,
  backgroundColor: colors.gray05,
});

export { LongRuntimeContentListView };

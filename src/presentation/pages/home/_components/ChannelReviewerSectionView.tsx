import React, { useCallback, useMemo } from 'react';
import { FlatList, TouchableOpacity, ListRenderItemInfo } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import styled from '@emotion/native';
import { RoundedAvatorView } from '@/presentation/components/image/RoundedAvatarView';
import Gap from '@/presentation/components/view/Gap';
import colors from '@/shared/styles/colors';
import textStyles from '@/shared/styles/textStyles';
import { RootStackParamList } from '@/shared/navigation/types';
import { routePages } from '@/shared/navigation/constant/routePages';
import { useReviewerChannels } from '../_hooks/useReviewerChannels';
import { ReviewerChannelModel } from '../_types/reviewerChannelModel.home';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

// 여러 곳에서 재사용되는 상수만 추출
const AVATAR_SIZE = 88;
const ITEM_SEPARATOR = 12;

// 스켈레톤 타입 정의
interface SkeletonItem {
  readonly __skeleton: true;
  readonly id: string;
}

type ListItem = ReviewerChannelModel | SkeletonItem;

const isSkeletonItem = (item: ListItem): item is SkeletonItem => '__skeleton' in item;

/** Skeleton 데이터 */
const SKELETON_DATA: SkeletonItem[] = Array.from({ length: 5 }, (_, i) => ({
  __skeleton: true,
  id: `skeleton-${i}`,
}));

/**
 * 채널 아이템 컴포넌트
 * Flutter: _ChannelSlider 내부 itemBuilder 참고
 */
const ChannelItem = React.memo(({ channel }: { channel: ReviewerChannelModel }) => {
  const navigation = useNavigation<NavigationProp>();

  const handlePress = useCallback(() => {
    navigation.navigate(routePages.channelDetail, {
      channelId: channel.id,
      channelName: channel.name,
      channelLogoUrl: channel.logoUrl,
      subscriberCount: channel.subscriberCount,
    });
  }, [navigation, channel]);

  return (
    <ItemContainer>
      <ItemTouchable onPress={handlePress} activeOpacity={0.8}>
        <AvatarWrapper>
          <RoundedAvatorView source={channel.logoUrl} size={AVATAR_SIZE} />
        </AvatarWrapper>
        <Gap size={10} />
        <ChannelNameText numberOfLines={1}>{channel.name}</ChannelNameText>
      </ItemTouchable>
    </ItemContainer>
  );
});
ChannelItem.displayName = 'ChannelItem';

/**
 * Skeleton 아이템 컴포넌트
 */
const ChannelSkeletonItem = React.memo(() => (
  <ItemContainer>
    <SkeletonCircle />
    <Gap size={10} />
    <SkeletonText />
  </ItemContainer>
));
ChannelSkeletonItem.displayName = 'ChannelSkeletonItem';

/**
 * 아이템 간격 컴포넌트
 */
const ItemSeparator = React.memo(() => <Gap size={ITEM_SEPARATOR} />);
ItemSeparator.displayName = 'ItemSeparator';

/**
 * FlatList getItemLayout (고정 크기 아이템 최적화)
 * length: 아이템 자체 크기 (separator는 별도 렌더링)
 * offset: 아이템 + separator 누적 오프셋
 */
const getItemLayout = (_: unknown, index: number) => ({
  length: AVATAR_SIZE,
  offset: (AVATAR_SIZE + ITEM_SEPARATOR) * index,
  index,
});

/** FlatList contentContainerStyle */
const listContentStyle = { paddingHorizontal: 18 };

/**
 * 리뷰어 채널 섹션
 * Flutter: _ChannelSlider 위젯 참고
 *
 * 구조:
 * - 섹션 제목: "놓치지 말아야 할 리뷰 채널"
 * - 수평 스크롤 채널 아바타 리스트
 * - 채널 탭 시 채널 상세 페이지로 이동
 */
function ChannelReviewerSectionView() {
  const { data: channels, isLoading, isError } = useReviewerChannels();

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<ListItem>) =>
      isSkeletonItem(item) ? <ChannelSkeletonItem /> : <ChannelItem channel={item} />,
    [],
  );

  const keyExtractor = useCallback((item: ListItem) => item.id, []);

  // 데이터를 useMemo로 감싸서 불필요한 리렌더 방지
  const listData = useMemo(
    (): ListItem[] => (isLoading ? SKELETON_DATA : channels),
    [isLoading, channels],
  );

  // 에러 상태면 섹션 숨김
  if (isError) {
    return null;
  }

  // 데이터 없으면 섹션 숨김 (로딩 중이 아닐 때)
  if (!isLoading && channels.length === 0) {
    return null;
  }

  return (
    <Container>
      <SectionTitle>놓치지 말아야 할 리뷰 채널</SectionTitle>
      <Gap size={12} />
      <ListContainer>
        <FlatList
          horizontal
          data={listData}
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
      </ListContainer>
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

const ListContainer = styled.View({
  height: 114,
});

const ItemContainer = styled.View({
  width: AVATAR_SIZE,
  alignItems: 'center',
});

const ItemTouchable = styled(TouchableOpacity)({
  alignItems: 'center',
});

const AvatarWrapper = styled.View({
  width: AVATAR_SIZE,
  height: AVATAR_SIZE,
  borderRadius: AVATAR_SIZE / 2,
  borderWidth: 0.5,
  borderColor: colors.gray03,
  overflow: 'hidden',
});

const ChannelNameText = styled.Text({
  ...textStyles.desc,
  color: colors.gray01,
  width: AVATAR_SIZE,
  textAlign: 'center',
});

const SkeletonCircle = styled.View({
  width: AVATAR_SIZE,
  height: AVATAR_SIZE,
  borderRadius: AVATAR_SIZE / 2,
  backgroundColor: colors.gray05,
});

const SkeletonText = styled.View({
  width: 60,
  height: 12,
  borderRadius: 4,
  backgroundColor: colors.gray05,
});

export { ChannelReviewerSectionView };

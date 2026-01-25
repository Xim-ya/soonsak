import { memo, useCallback } from 'react';
import { FlatList, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import styled from '@emotion/native';
import { LoadableImageView } from '@/presentation/components/image/LoadableImageView';
import Gap from '@/presentation/components/view/Gap';
import colors from '@/shared/styles/colors';
import textStyles from '@/shared/styles/textStyles';
import { AppSize } from '@/shared/utils/appSize';
import { formatter, TmdbImageSize } from '@/shared/utils/formatter';
import { RootStackParamList } from '@/shared/navigation/types';
import { routePages } from '@/shared/navigation/constant/routePages';
import { RelatedContentModel } from '../_types/relatedContentModel.cd';
import { useContentDetailRoute } from '../_hooks/useContentDetailRoute';
import { useRelatedContents } from '../_hooks/useRelatedContents';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface RelatedContentItemProps {
  readonly item: RelatedContentModel;
}

/**
 * 관련 콘텐츠 아이템 컴포넌트
 * 가로 스크롤 리스트 내 아이템으로 사용되므로 memo 적용
 */
const RelatedContentItem = memo(function RelatedContentItem({ item }: RelatedContentItemProps) {
  const navigation = useNavigation<NavigationProp>();

  const handlePress = useCallback(() => {
    navigation.push(routePages.contentDetail, {
      id: item.id,
      title: item.title,
      type: item.contentType,
    });
  }, [navigation, item.id, item.title, item.contentType]);

  // 포스터 이미지 URL 생성
  const posterUrl = formatter.prefixTmdbImgUrl(item.posterPath, {
    size: TmdbImageSize.w342,
  });

  return (
    <ItemContainer>
      <PosterTouchable onPress={handlePress} activeOpacity={0.8}>
        <LoadableImageView
          source={posterUrl}
          width={posterWidth}
          height={posterHeight}
          borderRadius={4}
        />
      </PosterTouchable>
      <Gap size={6} />
      <ContentTitle numberOfLines={2}>{item.title}</ContentTitle>
    </ItemContainer>
  );
});

/**
 * 아이템 키 추출 함수 (FlatList 최적화)
 */
const keyExtractor = (item: RelatedContentModel): string => item.id.toString();

/**
 * 아이템 구분선 컴포넌트 (FlatList 최적화 - 인라인 함수 제거)
 */
const ItemSeparator = (): React.ReactElement => <Gap size={12} />;

/**
 * RelatedContentsView - 관련 콘텐츠 섹션 컴포넌트
 *
 * TMDB API에서 추천 콘텐츠를 조회하고, Supabase에 등록된 콘텐츠만 필터링하여 표시합니다.
 * 가로 스크롤 형태의 포스터 리스트로 구현됩니다.
 * 관련 콘텐츠가 1개 이상일 때만 섹션이 노출됩니다.
 *
 * @example
 * <RelatedContentsView />
 */
function RelatedContentsView(): React.ReactElement | null {
  const { id, type } = useContentDetailRoute();
  const { data: relatedContents, isLoading } = useRelatedContents(id, type);

  // 로딩 중이거나 관련 콘텐츠가 없으면 렌더링하지 않음
  if (isLoading || relatedContents.length === 0) {
    return null;
  }

  return (
    <Container>
      <SectionTitle>관련 콘텐츠</SectionTitle>
      <Gap size={10} />
      <ContentListView
        horizontal
        data={relatedContents}
        renderItem={({ item }) => <RelatedContentItem item={item} />}
        keyExtractor={keyExtractor}
        ItemSeparatorComponent={ItemSeparator}
        showsHorizontalScrollIndicator={false}
      />
    </Container>
  );
}

/* Styled Components */
// 포스터 크기 설정 (가로:세로 = 2:3 비율)
const posterWidth = AppSize.ratioWidth(110);
const posterHeight = posterWidth * (3 / 2);

const Container = styled.View({
  backgroundColor: colors.black,
  paddingTop: 24,
  paddingBottom: 40,
});

const SectionTitle = styled.Text({
  ...textStyles.title2,
  paddingLeft: 16,
});

const ItemContainer = styled.View({
  width: posterWidth,
});

const ContentListView = styled(FlatList<RelatedContentModel>)({
  paddingLeft: 16,
});

const PosterTouchable = styled(TouchableOpacity)({
  width: posterWidth,
  height: posterHeight,
});

const ContentTitle = styled.Text({
  ...textStyles.body3,
  color: colors.white,
});

export { RelatedContentsView };

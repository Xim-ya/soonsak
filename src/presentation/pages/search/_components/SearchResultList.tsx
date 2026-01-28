import { useCallback } from 'react';
import { FlatList, ActivityIndicator, Keyboard } from 'react-native';
import styled from '@emotion/native';
import colors from '@/shared/styles/colors';
import { useSearchContext } from '../_provider/SearchProvider';
import { SearchResultModel } from '../_types/searchResultModel';
import { SearchResultItem } from './SearchResultItem';
import { SearchEmptyState } from './SearchEmptyState';

/**
 * 아이템 키 추출 함수 (FlatList 최적화)
 */
const keyExtractor = (item: SearchResultModel): string => `${item.contentType}-${item.id}`;

/**
 * SearchResultList - 검색 결과 리스트 컴포넌트
 */
function SearchResultList() {
  const { results, isLoading, isEmpty, error, debouncedSearchText } = useSearchContext();

  // 리스트 아이템 렌더링 (FlatList에 전달되므로 useCallback 필요)
  const renderItem = useCallback(
    ({ item }: { item: SearchResultModel }) => <SearchResultItem item={item} />,
    [],
  );

  // 검색어가 없는 초기 상태 (공백만 입력한 경우 포함)
  if (!debouncedSearchText.trim()) {
    return <SearchEmptyState type="initial" />;
  }

  // 로딩 중
  if (isLoading) {
    return (
      <LoadingContainer>
        <ActivityIndicator size="large" color={colors.main} />
      </LoadingContainer>
    );
  }

  // 에러 발생
  if (error) {
    return <SearchEmptyState type="error" />;
  }

  // 결과 없음
  if (isEmpty) {
    return <SearchEmptyState type="noResults" />;
  }

  return (
    <StyledFlatList
      data={results}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      onScrollBeginDrag={Keyboard.dismiss}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      removeClippedSubviews={true}
      maxToRenderPerBatch={10}
      windowSize={5}
    />
  );
}

/* Styled Components */
const StyledFlatList = styled(FlatList<SearchResultModel>)({
  flex: 1,
  backgroundColor: colors.black,
});

const LoadingContainer = styled.View({
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: colors.black,
});

export { SearchResultList };

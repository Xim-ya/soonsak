import React from 'react';
import styled from '@emotion/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import colors from '@/shared/styles/colors';
import Gap from '@/presentation/components/view/Gap';
import { BackButtonAppBar } from '@/presentation/components/app-bar/BackButtonAppBar';
import { SearchProvider } from './_provider/SearchProvider';
import { SearchBar } from './_components/SearchBar';
import { SearchResultList } from './_components/SearchResultList';

/**
 * SearchPageContent - 검색 화면 내부 컴포넌트
 *
 * SearchProvider 내부에서 사용되어야 합니다.
 */
function SearchPageContent() {
  const insets = useSafeAreaInsets();

  return (
    <Container topInset={insets.top}>
      <BackButtonAppBar />
      <Gap size={8} />
      <SearchBar />
      <Gap size={16} />
      <SearchResultList />
    </Container>
  );
}

/**
 * SearchPage - 검색 화면 메인 컴포넌트
 *
 * TMDB 키워드 검색 후 Supabase에 등록된 콘텐츠만 필터링하여 표시합니다.
 *
 * @example
 * // Navigation에서 사용
 * navigation.navigate(routePages.search);
 */
export default function SearchPage() {
  return (
    <SearchProvider>
      <SearchPageContent />
    </SearchProvider>
  );
}

/* Styled Components */
const Container = styled.View<{ topInset: number }>(({ topInset }) => ({
  flex: 1,
  backgroundColor: colors.black,
  paddingTop: topInset,
}));

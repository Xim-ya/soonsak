import React from 'react';
import styled from '@emotion/native';
import Gap from '@/presentation/components/view/Gap';
import { BackButtonAppBar } from '@/presentation/components/app-bar/BackButtonAppBar';
import { BasePage } from '@/presentation/components/page';
import { SearchProvider } from './_provider/SearchProvider';
import { SearchBar } from './_components/SearchBar';
import { SearchResultList } from './_components/SearchResultList';

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
      <BasePage>
        <Container>
          <BackButtonAppBar />
          <Gap size={8} />
          <SearchBar />
          <Gap size={16} />
          <SearchResultList />
        </Container>
      </BasePage>
    </SearchProvider>
  );
}

/* Styled Components */
const Container = styled.View({
  flex: 1,
});

/**
 * ExploreHeader - 탐색 화면 헤더
 *
 * 검색 버튼과 큐레이션 플레이스홀더를 포함합니다.
 * Collapsible Tab View의 헤더로 사용됩니다.
 */

import React, { useCallback } from 'react';
import { TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import styled from '@emotion/native';
import { SvgXml } from 'react-native-svg';
import colors from '@/shared/styles/colors';
import textStyles from '@/shared/styles/textStyles';
import { RootStackParamList } from '@/shared/navigation/types';
import { routePages } from '@/shared/navigation/constant/routePages';
import { CurationPlaceholder } from './CurationPlaceholder';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const searchIconSvg = `
<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M21 21L16.65 16.65M19 11C19 15.4183 15.4183 19 11 19C6.58172 19 3 15.4183 3 11C3 6.58172 6.58172 3 11 3C15.4183 3 19 6.58172 19 11Z" stroke="${colors.gray02}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
`;

const ExploreHeader = React.memo(function ExploreHeader(): React.ReactElement {
  const navigation = useNavigation<NavigationProp>();

  const handleSearchPress = useCallback(() => {
    navigation.navigate(routePages.search);
  }, [navigation]);

  return (
    <Container>
      {/* 검색 버튼 */}
      <SearchButton onPress={handleSearchPress} activeOpacity={0.7}>
        <SearchIconWrapper>
          <SvgXml xml={searchIconSvg} width={20} height={20} />
        </SearchIconWrapper>
        <SearchPlaceholder>콘텐츠 검색</SearchPlaceholder>
      </SearchButton>

      {/* 큐레이션 플레이스홀더 */}
      <CurationSection>
        <CurationPlaceholder />
      </CurationSection>
    </Container>
  );
});

const Container = styled.View({
  backgroundColor: colors.black,
  paddingTop: 16,
});

const SearchButton = styled(TouchableOpacity)({
  flexDirection: 'row',
  alignItems: 'center',
  backgroundColor: colors.gray05,
  borderRadius: 8,
  marginHorizontal: 16,
  paddingHorizontal: 12,
  height: 44,
});

const SearchIconWrapper = styled.View({
  marginRight: 8,
});

const SearchPlaceholder = styled.Text({
  ...textStyles.body2,
  color: colors.gray02,
});

const CurationSection = styled.View({
  marginTop: 16,
});

export { ExploreHeader };

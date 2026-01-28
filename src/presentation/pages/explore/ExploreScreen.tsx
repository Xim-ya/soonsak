import React from 'react';
import { TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import styled from '@emotion/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SvgXml } from 'react-native-svg';
import colors from '@/shared/styles/colors';
import textStyles from '@/shared/styles/textStyles';
import { RootStackParamList } from '@/shared/navigation/types';
import { routePages } from '@/shared/navigation/constant/routePages';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const SEARCH_ICON_SIZE = 20;
const HORIZONTAL_PADDING = 16;

// 검색 아이콘 SVG
const searchIconSvg = `
<svg width="${SEARCH_ICON_SIZE}" height="${SEARCH_ICON_SIZE}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M21 21L16.65 16.65M19 11C19 15.4183 15.4183 19 11 19C6.58172 19 3 15.4183 3 11C3 6.58172 6.58172 3 11 3C15.4183 3 19 6.58172 19 11Z" stroke="${colors.gray02}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
`;

/**
 * ExploreScreen - 탐색 탭 화면
 *
 * 검색 버튼을 통해 검색 화면으로 이동할 수 있습니다.
 */
export default function ExploreScreen() {
  const navigation = useNavigation<NavigationProp>();
  const insets = useSafeAreaInsets();

  const handleSearchPress = () => {
    navigation.navigate(routePages.search);
  };

  return (
    <Container topInset={insets.top}>
      <SearchButton onPress={handleSearchPress} activeOpacity={0.7}>
        <SearchIconWrapper>
          <SvgXml xml={searchIconSvg} width={SEARCH_ICON_SIZE} height={SEARCH_ICON_SIZE} />
        </SearchIconWrapper>
        <SearchPlaceholder>콘텐츠 검색</SearchPlaceholder>
      </SearchButton>
    </Container>
  );
}

/* Styled Components */
const Container = styled.View<{ topInset: number }>(({ topInset }) => ({
  flex: 1,
  backgroundColor: colors.black,
  paddingTop: topInset + 16,
}));

const SearchButton = styled(TouchableOpacity)({
  flexDirection: 'row',
  alignItems: 'center',
  backgroundColor: colors.gray05,
  borderRadius: 8,
  marginHorizontal: HORIZONTAL_PADDING,
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

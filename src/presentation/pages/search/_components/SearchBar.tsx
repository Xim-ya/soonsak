import React, { useRef, useEffect } from 'react';
import { TextInput, TouchableOpacity, Keyboard } from 'react-native';
import styled from '@emotion/native';
import { SvgXml } from 'react-native-svg';
import colors from '@/shared/styles/colors';
import textStyles from '@/shared/styles/textStyles';
import { useSearchContext } from '../_provider/SearchProvider';

const ICON_SIZE = 20;
const INPUT_HEIGHT = 44;
const HORIZONTAL_PADDING = 16;

// 검색 아이콘 SVG
const searchIconSvg = `
<svg width="${ICON_SIZE}" height="${ICON_SIZE}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M21 21L16.65 16.65M19 11C19 15.4183 15.4183 19 11 19C6.58172 19 3 15.4183 3 11C3 6.58172 6.58172 3 11 3C15.4183 3 19 6.58172 19 11Z" stroke="${colors.gray02}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
`;

// X 아이콘 SVG
const clearIconSvg = `
<svg width="${ICON_SIZE}" height="${ICON_SIZE}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M18 6L6 18M6 6L18 18" stroke="${colors.gray02}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
`;

/**
 * SearchBar - 검색 입력 바 컴포넌트
 *
 * 검색어 입력, 초기화 기능을 제공합니다.
 * 자동으로 포커스를 설정하고 키보드를 표시합니다.
 */
function SearchBar() {
  const { searchText, setSearchText, clearSearchText } = useSearchContext();
  const inputRef = useRef<TextInput>(null);
  const hasText = searchText.length > 0;

  // 컴포넌트 마운트 시 자동 포커스
  useEffect(() => {
    const timer = setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const handleClear = () => {
    clearSearchText();
    inputRef.current?.focus();
  };

  const handleSubmit = () => {
    Keyboard.dismiss();
  };

  return (
    <Container>
      <SearchIconWrapper>
        <SvgXml xml={searchIconSvg} width={ICON_SIZE} height={ICON_SIZE} />
      </SearchIconWrapper>
      <Input
        ref={inputRef}
        value={searchText}
        onChangeText={setSearchText}
        placeholder="콘텐츠 검색"
        placeholderTextColor={colors.gray02}
        returnKeyType="search"
        onSubmitEditing={handleSubmit}
        autoCorrect={false}
        autoCapitalize="none"
      />
      {hasText && (
        <ClearButton onPress={handleClear} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <SvgXml xml={clearIconSvg} width={ICON_SIZE} height={ICON_SIZE} />
        </ClearButton>
      )}
    </Container>
  );
}

/* Styled Components */
const Container = styled.View({
  flexDirection: 'row',
  alignItems: 'center',
  backgroundColor: colors.gray05,
  borderRadius: 8,
  marginHorizontal: HORIZONTAL_PADDING,
  paddingHorizontal: 12,
  height: INPUT_HEIGHT,
});

const SearchIconWrapper = styled.View({
  marginRight: 8,
});

const Input = styled.TextInput({
  flex: 1,
  ...textStyles.body2,
  color: colors.white,
  padding: 0,
});

const ClearButton = styled(TouchableOpacity)({
  marginLeft: 8,
  padding: 4,
});

export { SearchBar };

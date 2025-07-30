import React from 'react';
import styled from '@emotion/native';
import colors from '@/shared/styles/colors';
import textStyles from '@/shared/styles/textStyles';

/**
 * 콘텐츠 탭 컴포넌트
 * 콘텐츠 관련 정보를 표시합니다.
 */
export const ContentTab = React.memo(() => {
  return (
    <Container>
        <SectionTitle>콘텐츠 설명</SectionTitle>
        <Description>
          크리스토퍼 놀란 감독의 SF 대작으로, 근미래 지구의 환경 문제로 인해 우주로 떠나는 탐험대의 이야기를 그린 영화입니다. 
          과학적 고증과 감동적인 스토리가 어우러진 작품으로 많은 관객들에게 사랑받았습니다.
        </Description>
        
        <SectionTitle>주요 캐릭터</SectionTitle>
        <CharacterItem>
          <CharacterName>쿠퍼</CharacterName>
          <CharacterDescription>전직 NASA 조종사이자 농부</CharacterDescription>
        </CharacterItem>
        <CharacterItem>
          <CharacterName>머프</CharacterName>
          <CharacterDescription>쿠퍼의 딸, 천재적인 물리학자</CharacterDescription>
        </CharacterItem>
        <CharacterItem>
          <CharacterName>브랜드 박사</CharacterName>
          <CharacterDescription>NASA 과학자</CharacterDescription>
        </CharacterItem>
        
        <SectionTitle>키워드</SectionTitle>
        <KeywordContainer>
          <Keyword>시간여행</Keyword>
          <Keyword>우주탐험</Keyword>
          <Keyword>가족사랑</Keyword>
          <Keyword>과학</Keyword>
        </KeywordContainer>
      </Container>
  );
});

/* Styled Components */
const Container = styled.View({
  padding: 20,
  backgroundColor: colors.black,
});

const SectionTitle = styled.Text({
  ...textStyles.headline3,
  color: colors.white,
  marginBottom: 12,
  marginTop: 24,
});

const Description = styled.Text({
  ...textStyles.body2,
  color: colors.gray01,
  lineHeight: 22,
  marginBottom: 16,
});

const CharacterItem = styled.View({
  marginBottom: 16,
  paddingBottom: 12,
  borderBottomWidth: 1,
  borderBottomColor: colors.gray05,
});

const CharacterName = styled.Text({
  ...textStyles.body1,
  color: colors.white,
  marginBottom: 4,
  fontWeight: '600',
});

const CharacterDescription = styled.Text({
  ...textStyles.body3,
  color: colors.gray02,
});

const KeywordContainer = styled.View({
  flexDirection: 'row',
  flexWrap: 'wrap',
  gap: 8,
});

const Keyword = styled.Text({
  ...textStyles.caption1,
  color: colors.main,
  backgroundColor: colors.gray06,
  paddingHorizontal: 12,
  paddingVertical: 6,
  borderRadius: 16,
  borderWidth: 1,
  borderColor: colors.main,
  overflow: 'hidden',
});

ContentTab.displayName = 'ContentTab';
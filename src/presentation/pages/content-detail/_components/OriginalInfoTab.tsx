import React from 'react';
import styled from '@emotion/native';
import colors from '@/shared/styles/colors';
import textStyles from '@/shared/styles/textStyles';

/**
 * 원작 정보 탭 컴포넌트
 * 영화/드라마의 원작 정보를 표시합니다.
 */
export const OriginalInfoTab = React.memo(() => {
  return (
    <Container>
        <SectionTitle>기본 정보</SectionTitle>
        <InfoRow>
          <InfoLabel>감독</InfoLabel>
          <InfoValue>크리스토퍼 놀란</InfoValue>
        </InfoRow>
        <InfoRow>
          <InfoLabel>장르</InfoLabel>
          <InfoValue>SF, 드라마, 어드벤처</InfoValue>
        </InfoRow>
        <InfoRow>
          <InfoLabel>상영시간</InfoLabel>
          <InfoValue>169분</InfoValue>
        </InfoRow>
        <InfoRow>
          <InfoLabel>개봉일</InfoLabel>
          <InfoValue>2014년 11월 6일</InfoValue>
        </InfoRow>
        <InfoRow>
          <InfoLabel>제작비</InfoLabel>
          <InfoValue>$165,000,000</InfoValue>
        </InfoRow>

        <SectionTitle>주요 출연진</SectionTitle>
        <CastItem>
          <CastName>매튜 매커너헤이</CastName>
          <CastRole>쿠퍼 역</CastRole>
        </CastItem>
        <CastItem>
          <CastName>앤 해서웨이</CastName>
          <CastRole>아멜리아 브랜드 역</CastRole>
        </CastItem>
        <CastItem>
          <CastName>제시카 차스테인</CastName>
          <CastRole>머프 (성인) 역</CastRole>
        </CastItem>
        <CastItem>
          <CastName>마이클 케인</CastName>
          <CastRole>존 브랜드 교수 역</CastRole>
        </CastItem>

        <SectionTitle>제작 정보</SectionTitle>
        <InfoRow>
          <InfoLabel>제작사</InfoLabel>
          <InfoValue>워너 브라더스, 레전더리 엔터테인먼트</InfoValue>
        </InfoRow>
        <InfoRow>
          <InfoLabel>배급사</InfoLabel>
          <InfoValue>워너 브라더스</InfoValue>
        </InfoRow>
        <InfoRow>
          <InfoLabel>음악</InfoLabel>
          <InfoValue>한스 짐머</InfoValue>
        </InfoRow>
        <InfoRow>
          <InfoLabel>촬영</InfoLabel>
          <InfoValue>호이테 반 호이테마</InfoValue>
        </InfoRow>

        <SectionTitle>수상 내역</SectionTitle>
        <AwardItem>
          <AwardName>아카데미 시각효과상</AwardName>
          <AwardYear>2015</AwardYear>
        </AwardItem>
        <AwardItem>
          <AwardName>BAFTA 시각효과상</AwardName>
          <AwardYear>2015</AwardYear>
        </AwardItem>
        <AwardItem>
          <AwardName>크리틱스 초이스 어워드 시각효과상</AwardName>
          <AwardYear>2015</AwardYear>
        </AwardItem>
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
  marginBottom: 16,
  marginTop: 24,
});

const InfoRow = styled.View({
  flexDirection: 'row',
  marginBottom: 12,
  paddingBottom: 8,
});

const InfoLabel = styled.Text({
  ...textStyles.body2,
  color: colors.gray02,
  width: 80,
  flexShrink: 0,
});

const InfoValue = styled.Text({
  ...textStyles.body2,
  color: colors.white,
  flex: 1,
});

const CastItem = styled.View({
  marginBottom: 16,
  paddingBottom: 12,
  borderBottomWidth: 1,
  borderBottomColor: colors.gray05,
});

const CastName = styled.Text({
  ...textStyles.body1,
  color: colors.white,
  marginBottom: 4,
  fontWeight: '600',
});

const CastRole = styled.Text({
  ...textStyles.body3,
  color: colors.gray02,
});

const AwardItem = styled.View({
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: 12,
  paddingBottom: 8,
});

const AwardName = styled.Text({
  ...textStyles.body2,
  color: colors.white,
  flex: 1,
});

const AwardYear = styled.Text({
  ...textStyles.body3,
  color: colors.gray02,
});

OriginalInfoTab.displayName = 'OriginalInfoTab';
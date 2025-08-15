import React from 'react';
import { FlatList, Dimensions } from 'react-native';
import styled from '@emotion/native';
import textStyles from '@/shared/styles/textStyles';
import colors from '@/shared/styles/colors';
import { RoundedAvatorView } from '@/presentation/components/image/RoundedAvatarView';

// 임시 mock 데이터
const mockCreditList = [
  {
    id: '1',
    name: '송강호',
    role: '기택 역',
    profilePath:
      'https://media.themoviedb.org/t/p/w600_and_h900_bestv2/s6tflSD20MGz04ZR2R1lZvhmC4Y.jpg',
  },
  {
    id: '2',
    name: '이선균',
    role: '동익 역',
    profilePath:
      'https://media.themoviedb.org/t/p/w600_and_h900_bestv2/s6tflSD20MGz04ZR2R1lZvhmC4Y.jpg',
  },
  {
    id: '3',
    name: '조여정',
    role: '연교 역',
    profilePath:
      'https://media.themoviedb.org/t/p/w600_and_h900_bestv2/s6tflSD20MGz04ZR2R1lZvhmC4Y.jpg',
  },
  {
    id: '4',
    name: '최우식',
    role: '기우 역',
    profilePath:
      'https://media.themoviedb.org/t/p/w600_and_h900_bestv2/s6tflSD20MGz04ZR2R1lZvhmC4Y.jpg',
  },
  {
    id: '5',
    name: '박소담',
    role: '기정 역',
    profilePath:
      'https://media.themoviedb.org/t/p/w600_and_h900_bestv2/s6tflSD20MGz04ZR2R1lZvhmC4Y.jpg',
  },
  {
    id: '6',
    name: '이정은',
    role: '문광 역',
    profilePath:
      'https://media.themoviedb.org/t/p/w600_and_h900_bestv2/s6tflSD20MGz04ZR2R1lZvhmC4Y.jpg',
  },
  {
    id: '7',
    name: '장혜진',
    role: '충숙 역',
    profilePath:
      'https://media.themoviedb.org/t/p/w600_and_h900_bestv2/s6tflSD20MGz04ZR2R1lZvhmC4Y.jpg',
  },
  {
    id: '8',
    name: '박명훈',
    role: '근세 역',
    profilePath:
      'https://media.themoviedb.org/t/p/w600_and_h900_bestv2/s6tflSD20MGz04ZR2R1lZvhmC4Y.jpg',
  },
];

interface CreditInfo {
  id: string;
  name: string;
  role: string;
  profilePath: string;
}

function CaseView() {
  const { width: screenWidth } = Dimensions.get('window');
  const pageWidth = screenWidth * 0.93; // viewportFraction: 0.93과 동일

  // 3개씩 순서대로 채우기 (마지막 페이지에만 남은 개수)
  const itemsPerPage = 3;
  const pages: CreditInfo[][] = [];
  for (let i = 0; i < mockCreditList.length; i += itemsPerPage) {
    pages.push(mockCreditList.slice(i, i + itemsPerPage));
  }

  const renderPage = ({ item: page }: { item: CreditInfo[]; index: number }) => (
    <PageContainer style={{ width: pageWidth }}>
      {page.map((credit) => (
        <CreditItem key={credit.id}>
          <RoundedAvatorView source={credit.profilePath} size={56} />
          <InfoContainer>
            <NameText>{credit.name}</NameText>
            <RoleText>{credit.role}</RoleText>
          </InfoContainer>
        </CreditItem>
      ))}
    </PageContainer>
  );

  return (
    <Container>
      {mockCreditList.length > 0 && (
        <>
          <TitleText>출연진</TitleText>

          <FlatList
            data={pages}
            renderItem={renderPage}
            keyExtractor={(_, index) => index.toString()}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            snapToInterval={pageWidth}
            snapToAlignment="start"
            decelerationRate="fast"
            contentContainerStyle={{ paddingHorizontal: 16 }}
          />

          <BottomSpace />
        </>
      )}
    </Container>
  );
}

/* Styled Components */
const Container = styled.View({
  flex: 1,
});

const TitleText = styled.Text({
  ...textStyles.title2,
  color: colors.white,
  paddingLeft: 16,
  paddingBottom: 12,
});

const PageContainer = styled.View({
  height: 220,
  justifyContent: 'flex-start',
  paddingRight: 16,
});

const CreditItem = styled.View({
  flexDirection: 'row',
  alignItems: 'center',
  marginBottom: 16,
});

const InfoContainer = styled.View({
  marginLeft: 12,
  justifyContent: 'center',
});

const NameText = styled.Text({
  ...textStyles.alert2,
  color: colors.white,
  marginBottom: 2,
});

const RoleText = styled.Text({
  ...textStyles.alert2,
  color: colors.gray01,
});

const BottomSpace = styled.View({
  height: 40,
});

export default CaseView;

/**
 * ExploreHeader - 탐색 화면 헤더
 *
 * 로그인 상태에 따라 다른 콘텐츠를 표시합니다:
 * - 로그인: 랜덤 큐레이션 캐러셀
 * - 비로그인: 로그인 유도 카드 (백드롭 이미지 배경)
 *
 * Collapsible Tab View의 헤더로 사용됩니다.
 */

import React, { useCallback } from 'react';
import { ImageBackground, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import styled from '@emotion/native';
import colors from '@/shared/styles/colors';
import textStyles from '@/shared/styles/textStyles';
import { AppSize } from '@/shared/utils/appSize';
import { RootStackParamList } from '@/shared/navigation/types';
import { routePages } from '@/shared/navigation/constant/routePages';
import {
  DarkedLinearShadow,
  LinearAlign,
} from '@/presentation/components/shadow/DarkedLinearShadow';
// TODO: 개발 완료 후 복원
// import { useAuth } from '@/shared/providers/AuthProvider';
// import { CurationCarousel } from './CurationCarousel';
import { CurationPromptCard } from './CurationPromptCard';
import { useRandomBackdrop } from '../_hooks/useRandomBackdrop';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

// 레이아웃 상수
const HEADER_HEIGHT = AppSize.ratioHeight(280);
const TOP_GRADIENT_HEIGHT = AppSize.ratioHeight(80);
const BOTTOM_GRADIENT_HEIGHT = AppSize.ratioHeight(180);

const ExploreHeader = React.memo(function ExploreHeader(): React.ReactElement {
  const navigation = useNavigation<NavigationProp>();
  // TODO: 개발 완료 후 로그인 상태에 따른 분기 복원
  // const { status } = useAuth();
  // const isLoggedIn = status === 'authenticated';

  const { backdropUrl } = useRandomBackdrop();

  const handleLoginPress = useCallback(() => {
    navigation.navigate(routePages.login);
  }, [navigation]);

  // 백드롭 이미지가 없을 때 폴백 렌더링
  if (!backdropUrl) {
    return (
      <FallbackContainer>
        <TitleRow>
          <TitleText>탐색</TitleText>
          <LoginButton onPress={handleLoginPress} activeOpacity={0.8}>
            <LoginButtonText>로그인</LoginButtonText>
          </LoginButton>
        </TitleRow>
        <CurationPromptCard />
      </FallbackContainer>
    );
  }

  return (
    <Container>
      <BackdropImage source={{ uri: backdropUrl }} resizeMode="cover">
        {/* 상단 그라데이션 */}
        <DarkedLinearShadow height={TOP_GRADIENT_HEIGHT} align={LinearAlign.topBottom} />

        <ContentOverlay>
          <TitleRow>
            <TitleText>탐색</TitleText>
            <LoginButton onPress={handleLoginPress} activeOpacity={0.8}>
              <LoginButtonText>로그인</LoginButtonText>
            </LoginButton>
          </TitleRow>

          <CardSection>
            {/* TODO: 개발 완료 후 복원 - {isLoggedIn ? <CurationCarousel /> : <CurationPromptCard />} */}
            <CurationPromptCard />
          </CardSection>
        </ContentOverlay>

        {/* 하단 그라데이션 */}
        <DarkedLinearShadow height={BOTTOM_GRADIENT_HEIGHT} align={LinearAlign.bottomTop} />
      </BackdropImage>
    </Container>
  );
});

/* Styled Components */
const Container = styled.View({
  height: HEADER_HEIGHT,
  backgroundColor: colors.black,
});

const FallbackContainer = styled.View({
  backgroundColor: colors.black,
  paddingTop: 16,
  paddingBottom: 20,
});

const BackdropImage = styled(ImageBackground)({
  flex: 1,
  width: '100%',
});

const ContentOverlay = styled.View({
  position: 'relative',
  flex: 1,
  justifyContent: 'space-between',
  paddingTop: AppSize.statusBarHeight + 16,
  paddingBottom: 24,
  zIndex: 1,
});

const TitleRow = styled.View({
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingHorizontal: 16,
  marginBottom: 16,
});

const CardSection = styled.View({
  flex: 1,
  justifyContent: 'flex-end',
});

const TitleText = styled.Text({
  ...textStyles.headline1,
  color: colors.white,
});

const LoginButton = styled(TouchableOpacity)({
  backgroundColor: colors.gray04,
  paddingHorizontal: 16,
  paddingVertical: 8,
  borderRadius: 20,
});

const LoginButtonText = styled.Text({
  ...textStyles.alert1,
  color: colors.white,
});

export { ExploreHeader };

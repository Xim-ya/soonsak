import { useCallback, useEffect } from 'react';
import { TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import styled from '@emotion/native';
import { AppSize } from '@/shared/utils/appSize';
import colors from '@/shared/styles/colors';
import textStyles from '@/shared/styles/textStyles';
import { useAuth } from '@/shared/providers/AuthProvider';
import { LoginBackground } from './_components/LoginBackground';
import { LoginIntroText } from './_components/LoginIntroText';
import { SocialLoginButtonGroup } from './_components/SocialLoginButtonGroup';
import { useSocialLogin } from './_hooks/useSocialLogin';

/**
 * LoginPage - 로그인 페이지
 *
 * 소셜 로그인(카카오, Google, Apple)을 제공하는 로그인 화면입니다.
 * Flutter Plotz 디자인을 기반으로 구현되었습니다.
 *
 * 구성:
 * - 배경 이미지 + 상단/하단 그래디언트
 * - 인트로 텍스트 (SVG)
 * - 소셜 로그인 버튼 그룹
 *
 * @example
 * // StackNavigator에서 사용
 * <Stack.Screen name="Login" component={LoginPage} />
 */
export default function LoginPage() {
  const navigation = useNavigation();
  const { status } = useAuth();
  const { handleLogin, loadingProvider } = useSocialLogin();

  // 로그인 성공 시 자동으로 이전 화면으로 이동
  useEffect(() => {
    if (status === 'authenticated') {
      navigation.goBack();
    }
  }, [status, navigation]);

  const handleGuestPress = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  return (
    <Container>
      {/* 배경 이미지 + 그래디언트 */}
      <LoginBackground />

      {/* 콘텐츠 영역 */}
      <ContentContainer>
        {/* 상단 인트로 텍스트 */}
        <TopSection>
          <LoginIntroText />
        </TopSection>

        {/* 하단 로그인 버튼 그룹 */}
        <BottomSection>
          <SocialLoginButtonGroup onLogin={handleLogin} loadingProvider={loadingProvider} />
          <GuestButton onPress={handleGuestPress} activeOpacity={0.7}>
            <GuestButtonText>비회원으로 둘러보기</GuestButtonText>
          </GuestButton>
        </BottomSection>
      </ContentContainer>
    </Container>
  );
}

/* Styled Components */

const Container = styled.View({
  flex: 1,
});

const ContentContainer = styled.View({
  flex: 1,
  justifyContent: 'space-between',
  paddingTop: AppSize.statusBarHeight + 60,
  paddingBottom: AppSize.bottomInset + 40,
  paddingHorizontal: 24,
});

const TopSection = styled.View({
  // 상단 인트로 영역
});

const BottomSection = styled.View({
  // 하단 버튼 영역
});

const GuestButton = styled(TouchableOpacity)({
  marginTop: 24,
  alignItems: 'center',
});

const GuestButtonText = styled.Text({
  ...textStyles.body2,
  color: colors.gray02,
  textDecorationLine: 'underline',
});

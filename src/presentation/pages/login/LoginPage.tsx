import styled from '@emotion/native';
import { AppSize } from '@/shared/utils/appSize';
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
  const { handleLogin, loadingProvider } = useSocialLogin();

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

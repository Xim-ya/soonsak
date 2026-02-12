/**
 * ProfileSetupPage - 프로필 설정 페이지
 *
 * 초기 설정과 수정 두 가지 모드를 지원합니다:
 * - initial: 회원가입 직후 진입, 뒤로가기 차단
 * - edit: 마이페이지에서 진입, 뒤로가기 허용
 *
 * @example
 * // 초기 설정 모드
 * navigation.navigate('ProfileSetup', { mode: 'initial' });
 *
 * // 수정 모드
 * navigation.navigate('ProfileSetup', { mode: 'edit' });
 */

import React from 'react';
import { TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import styled from '@emotion/native';
import colors from '@/shared/styles/colors';
import textStyles from '@/shared/styles/textStyles';
import { AppSize } from '@/shared/utils/appSize';
import { BackButtonAppBar } from '@/presentation/components/app-bar/BackButtonAppBar';
import type { RootStackParamList } from '@/shared/navigation/types';
import { routePages } from '@/shared/navigation/constant/routePages';
import { useProfileSetup } from './_hooks/useProfileSetup';
import { NicknameInput } from './_components/NicknameInput';
import { ProfileImagePicker } from './_components/ProfileImagePicker';

type ProfileSetupRouteProp = RouteProp<RootStackParamList, typeof routePages.profileSetup>;

/** 레이아웃 스타일 상수 */
const keyboardAvoidingStyle = { flex: 1 } as const;
const scrollContentStyle = { flexGrow: 1 } as const;

export default function ProfileSetupPage(): React.ReactElement {
  const route = useRoute<ProfileSetupRouteProp>();
  const { mode } = route.params;

  const {
    nickname,
    setNickname,
    avatarUrl,
    error,
    isLoading,
    isValid,
    isChanged,
    handlePickImage,
    handleSubmit,
  } = useProfileSetup({ mode });

  // 모드별 UI 텍스트
  const title = mode === 'initial' ? '프로필 설정' : '프로필 수정';
  const buttonText = mode === 'initial' ? '시작하기' : '저장';
  const showBackButton = mode === 'edit';

  // 버튼 활성화 조건
  const isButtonEnabled = mode === 'initial' ? isValid : isValid && isChanged;

  return (
    <Container>
      {/* 앱바 */}
      <AppBarContainer>
        <BackButtonAppBar title={title} showBackButton={showBackButton} centerAligned />
      </AppBarContainer>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={keyboardAvoidingStyle}
      >
        <ScrollView
          contentContainerStyle={scrollContentStyle}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* 콘텐츠 영역 */}
          <ContentContainer>
            {/* 프로필 이미지 */}
            <ImageSection>
              <ProfileImagePicker imageUrl={avatarUrl} onPress={handlePickImage} />
            </ImageSection>

            {/* 닉네임 입력 */}
            <InputSection>
              <SectionLabel>닉네임</SectionLabel>
              <NicknameInput
                value={nickname}
                onChangeText={setNickname}
                error={error}
                autoFocus={mode === 'initial'}
              />
            </InputSection>
          </ContentContainer>

          {/* 하단 버튼 */}
          <ButtonContainer>
            <SubmitButton
              onPress={handleSubmit}
              disabled={!isButtonEnabled || isLoading}
              isEnabled={isButtonEnabled && !isLoading}
              activeOpacity={0.8}
            >
              {isLoading ? (
                <ButtonText>저장 중...</ButtonText>
              ) : (
                <ButtonText>{buttonText}</ButtonText>
              )}
            </SubmitButton>
          </ButtonContainer>
        </ScrollView>
      </KeyboardAvoidingView>
    </Container>
  );
}

/* Styled Components */

const Container = styled.View({
  flex: 1,
  backgroundColor: colors.black,
});

const AppBarContainer = styled.View({
  paddingTop: AppSize.statusBarHeight,
});

const ContentContainer = styled.View({
  flex: 1,
  paddingHorizontal: 24,
  paddingTop: 32,
});

const ImageSection = styled.View({
  alignItems: 'center',
  marginBottom: 40,
});

const InputSection = styled.View({
  marginBottom: 24,
});

const SectionLabel = styled.Text({
  ...textStyles.title2,
  color: colors.white,
  marginBottom: 12,
});

const ButtonContainer = styled.View({
  paddingHorizontal: 24,
  paddingBottom: AppSize.bottomInset + 24,
  paddingTop: 16,
});

const SubmitButton = styled(TouchableOpacity)<{ isEnabled: boolean }>(({ isEnabled }) => ({
  height: 52,
  borderRadius: 12,
  backgroundColor: isEnabled ? colors.primary : colors.gray04,
  justifyContent: 'center',
  alignItems: 'center',
}));

const ButtonText = styled.Text({
  ...textStyles.body1,
  color: colors.white,
});

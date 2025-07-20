import React, { useCallback, useEffect } from 'react';
import {
  View,
  SafeAreaView,
  StatusBar,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import styled from '@emotion/native';
import colors from '@/shared/styles/colors';

// 일반적인 사용 패턴에 맞춘 Props 간소화
interface BasePageProps {
  /** 페이지 내용 */
  children: React.ReactNode;
  /** 배경색 (기본: colors.black) */
  backgroundColor?: string;
  /** 상태바 스타일 (기본: 'light-content') */
  statusBarStyle?: 'default' | 'light-content' | 'dark-content';
  /** SafeArea 사용 여부 (기본: true) */
  useSafeArea?: boolean;
  /** 스크롤 가능 여부 (기본: false) */
  scrollable?: boolean;
  /** 키보드 자동 조정 (기본: true) */
  keyboardAvoidingEnabled?: boolean;
  /** 터치로 키보드 해제 (기본: true) */
  dismissKeyboardOnTap?: boolean;
  
  // 라이프사이클 콜백 (간소화)
  onMount?: () => void;
  onUnmount?: () => void;
  onFocus?: () => void;
  onBlur?: () => void;
}

/**
 * 앱의 모든 화면에서 사용하는 기본 페이지 컴포넌트
 * 
 * 기본 설정:
 * - 검은색 배경 (colors.black)
 * - SafeArea 적용
 * - 밝은 상태바 (light-content)
 * - 키보드 자동 조정
 */
export const BasePage = React.memo<BasePageProps>(({
  children,
  backgroundColor = colors.black,
  statusBarStyle = 'light-content',
  useSafeArea = true,
  scrollable = false,
  keyboardAvoidingEnabled = true,
  dismissKeyboardOnTap = true,
  onMount,
  onUnmount,
  onFocus,
  onBlur,
}) => {
  // 라이프사이클 관리
  useEffect(() => {
    onMount?.();
    return () => onUnmount?.();
  }, [onMount, onUnmount]);

  useFocusEffect(
    useCallback(() => {
      onFocus?.();
      return () => onBlur?.();
    }, [onFocus, onBlur])
  );

  // 키보드 해제
  const handleDismissKeyboard = useCallback(() => {
    if (dismissKeyboardOnTap) {
      Keyboard.dismiss();
    }
  }, [dismissKeyboardOnTap]);

  // 콘텐츠 렌더링
  const renderContent = () => {
    let content = children;

    // 스크롤 처리
    if (scrollable) {
      content = (
        <StyledScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {content}
        </StyledScrollView>
      );
    }

    // 키보드 회피 처리
    if (keyboardAvoidingEnabled) {
      content = (
        <StyledKeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          {content}
        </StyledKeyboardAvoidingView>
      );
    }

    return content;
  };

  // 터치 처리 래퍼
  const wrapWithTouchHandler = (content: React.ReactNode) => {
    if (dismissKeyboardOnTap) {
      return (
        <TouchableWithoutFeedback onPress={handleDismissKeyboard}>
          <TouchableContainer>{content}</TouchableContainer>
        </TouchableWithoutFeedback>
      );
    }
    return content;
  };

  // 메인 콘텐츠
  const mainContent = (
    <Container backgroundColor={backgroundColor}>
      <StatusBar
        barStyle={statusBarStyle}
        backgroundColor={backgroundColor}
        translucent={Platform.OS === 'android'}
      />
      {renderContent()}
    </Container>
  );

  // SafeArea 적용
  if (useSafeArea) {
    return (
      <SafeContainer backgroundColor={backgroundColor}>
        <StyledSafeAreaView backgroundColor={backgroundColor}>
          {wrapWithTouchHandler(mainContent)}
        </StyledSafeAreaView>
      </SafeContainer>
    );
  }

  return (
    <SafeContainer backgroundColor={backgroundColor}>
      {wrapWithTouchHandler(mainContent)}
    </SafeContainer>
  );
});

/* Styled Components */
const SafeContainer = styled.View<{ backgroundColor: string }>(({ backgroundColor }) => ({
  flex: 1,
  backgroundColor,
}));

const StyledSafeAreaView = styled(SafeAreaView)<{ backgroundColor: string }>(({ backgroundColor }) => ({
  flex: 1,
  backgroundColor,
}));

const Container = styled.View<{ backgroundColor: string }>(({ backgroundColor }) => ({
  flex: 1,
  backgroundColor,
}));

const TouchableContainer = styled.View({
  flex: 1,
});

const StyledKeyboardAvoidingView = styled(KeyboardAvoidingView)({
  flex: 1,
});

const StyledScrollView = styled(ScrollView)({
  flex: 1,
});

BasePage.displayName = 'BasePage';
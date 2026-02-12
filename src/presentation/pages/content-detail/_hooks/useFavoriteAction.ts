/**
 * useFavoriteAction - 찜하기 액션 상태 관리 훅
 *
 * 찜하기 관련 상태(로그인 다이얼로그, 액션 바텀시트)를 관리합니다.
 * Discussion #42: 다이얼로그 상태 관리 패턴 적용
 */

import { useCallback, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/shared/navigation/types';
import { routePages } from '@/shared/navigation/constant/routePages';
import { useAuth } from '@/shared/providers/AuthProvider';
import { useFavoriteStatus, useToggleFavorite } from '@/features/favorites';
import { useSocialLogin } from '@/presentation/pages/login/_hooks/useSocialLogin';
import type { ContentType } from '@/presentation/types/content/contentType.enum';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface UseFavoriteActionParams {
  readonly contentId: number;
  readonly contentType: ContentType;
}

interface UseFavoriteActionReturn {
  /** 찜 상태 */
  readonly isFavorited: boolean;
  /** 로그인 다이얼로그 표시 여부 */
  readonly isLoginDialogVisible: boolean;
  /** 액션 바텀시트 표시 여부 */
  readonly isActionSheetVisible: boolean;
  /** 카카오 로그인 로딩 중 여부 */
  readonly isKakaoLoading: boolean;
  /** 더보기 버튼 클릭 핸들러 */
  readonly handleMorePress: () => void;
  /** 찜 토글 핸들러 */
  readonly handleToggleFavorite: () => void;
  /** 액션 바텀시트 닫기 */
  readonly handleCloseActionSheet: () => void;
  /** 로그인 다이얼로그 닫기 */
  readonly handleCloseDialog: () => void;
  /** 카카오 로그인 */
  readonly handleKakaoLogin: () => void;
  /** 다른 방법 로그인 */
  readonly handleOtherLogin: () => void;
}

export function useFavoriteAction({
  contentId,
  contentType,
}: UseFavoriteActionParams): UseFavoriteActionReturn {
  const navigation = useNavigation<NavigationProp>();

  // 인증 상태
  const { status } = useAuth();
  const isLoggedIn = status === 'authenticated';

  // 찜 상태 및 토글
  const { data: favoriteStatus } = useFavoriteStatus(contentId, contentType);
  const { mutate: toggleFavorite } = useToggleFavorite();

  // 로그인 다이얼로그 상태
  const [isLoginDialogVisible, setLoginDialogVisible] = useState(false);
  const { handleLogin, loadingProvider } = useSocialLogin();

  // 액션 바텀시트 상태
  const [isActionSheetVisible, setActionSheetVisible] = useState(false);

  // 더보기 버튼 클릭 핸들러 (로그인 여부와 관계없이 바텀시트 표시)
  const handleMorePress = useCallback(() => {
    setActionSheetVisible(true);
  }, []);

  // 찜 토글 핸들러 (비로그인 시 로그인 유도)
  const handleToggleFavorite = useCallback(() => {
    if (!isLoggedIn) {
      setActionSheetVisible(false);
      setLoginDialogVisible(true);
      return;
    }
    toggleFavorite({ contentId, contentType });
  }, [isLoggedIn, contentId, contentType, toggleFavorite]);

  // 액션 바텀시트 닫기
  const handleCloseActionSheet = useCallback(() => {
    setActionSheetVisible(false);
  }, []);

  // 로그인 다이얼로그 핸들러
  const handleCloseDialog = useCallback(() => {
    setLoginDialogVisible(false);
  }, []);

  const handleKakaoLogin = useCallback(() => {
    handleLogin('kakao');
    setLoginDialogVisible(false);
  }, [handleLogin]);

  const handleOtherLogin = useCallback(() => {
    navigation.navigate(routePages.login);
    setLoginDialogVisible(false);
  }, [navigation]);

  return {
    isFavorited: favoriteStatus?.isFavorited ?? false,
    isLoginDialogVisible,
    isActionSheetVisible,
    isKakaoLoading: loadingProvider === 'kakao',
    handleMorePress,
    handleToggleFavorite,
    handleCloseActionSheet,
    handleCloseDialog,
    handleKakaoLogin,
    handleOtherLogin,
  };
}

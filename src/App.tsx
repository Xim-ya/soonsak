import { NavigationContainer } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import StackNavigator from './shared/navigation/navigator/StackNavigator';
import '@/shared/exntensions/arrayExtension';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useEffect } from 'react';
import { AppSize } from '@/shared/utils/appSize';

// 개발 모드에서 YouTube API 테스트 비활성화 (성능 최적화)
// if (__DEV__) {
//   import('@/utils/youtube/testYoutube');
// }

// React Query Client 생성 (컴포넌트 밖에서 생성)
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60000, // 1분간 fresh 상태 유지
      gcTime: 15 * 60000, // 15분간 캐시 유지 (v5에서 cacheTime -> gcTime)
      retry: 1,
      refetchOnWindowFocus: false, // 모바일에서는 필요 없음
    },
  },
});

// AppSize 초기화를 위한 내부 컴포넌트
function AppContent() {
  const insets = useSafeAreaInsets();

  useEffect(() => {
    // AppSize 초기화
    AppSize.init(insets);
    console.log('AppSize 초기화', AppSize);

    // 앱 종료 시 정리
    return () => {
      AppSize.destroy();
    };
  }, [insets]);

  return (
    <>
      <StatusBar style="light" />
      <NavigationContainer>
        <StackNavigator />
      </NavigationContainer>
    </>
  );
}

export default function App() {
  const [fontsLoaded] = useFonts({
    'Pretendard-Bold': require('../assets/fonts/Pretendard-Bold.otf'),
    'Pretendard-SemiBold': require('../assets/fonts/Pretendard-SemiBold.otf'),
    'Pretendard-Medium': require('../assets/fonts/Pretendard-Medium.otf'),
    'Pretendard-Regular': require('../assets/fonts/Pretendard-Regular.otf'),
    staatliches_regular: require('../assets/fonts/Staatliches-Regular.ttf'),
  });

  if (!fontsLoaded) {
    return <></>;
  }

  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <QueryClientProvider client={queryClient}>
          <AppContent />
        </QueryClientProvider>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}

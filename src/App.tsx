import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import StackNavigator from './shared/navigation/StackNavigator';
import TabNavigator from './shared/navigation/TabNavigator';

// React Query Client 생성
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

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <NavigationContainer>
        <TabNavigator />
      </NavigationContainer>
    </QueryClientProvider>
  );
}



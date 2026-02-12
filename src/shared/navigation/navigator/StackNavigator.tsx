import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TabNavigator from './TabNavigator';
import ContentDetailPage from '../../../presentation/pages/content-detail/ContentDetailPage';
import { PlayerPage } from '../../../presentation/pages/player/PlayerPage';
import ChannelDetailPage from '../../../presentation/pages/channel-detail/ChannelDetailPage';
import SearchPage from '../../../presentation/pages/search/SearchPage';
import ChannelSelectionPage from '../../../presentation/pages/channel-selection/ChannelSelectionPage';
import { MediaListPage } from '../../../presentation/pages/media/MediaListPage';
import { ImageDetailPage } from '../../../presentation/pages/media/ImageDetailPage';
import LoginPage from '../../../presentation/pages/login/LoginPage';
import { RootStackParamList } from '../types';
import { routePages } from '../constant/routePages';
import colors from '@/shared/styles/colors';
import { useAuth } from '@/shared/providers/AuthProvider';

const Stack = createNativeStackNavigator<RootStackParamList>();

/**
 * StackNavigator - 메인 네비게이션
 *
 * - status === 'idle': 세션 복원 중 → null 반환 (스플래시 대기)
 * - 그 외: 메인 스크린 스택 표시 (비회원/회원 모두 접근 가능)
 *
 * 로그인 화면은 메인 스택 위에 모달로 표시됩니다.
 */
export default function StackNavigator() {
  const { status } = useAuth();

  // 세션 복원 중
  if (status === 'idle') {
    return null;
  }

  return (
    <Stack.Navigator
      screenOptions={{
        contentStyle: { backgroundColor: colors.black },
        animation: 'default',
      }}
    >
      <Stack.Screen
        name={routePages.mainTabs}
        component={TabNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={routePages.login}
        component={LoginPage}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={routePages.contentDetail}
        component={ContentDetailPage}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={routePages.player}
        component={PlayerPage}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={routePages.channelDetail}
        component={ChannelDetailPage}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={routePages.search}
        component={SearchPage}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={routePages.channelSelection}
        component={ChannelSelectionPage}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={routePages.mediaList}
        component={MediaListPage}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={routePages.imageDetail}
        component={ImageDetailPage}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

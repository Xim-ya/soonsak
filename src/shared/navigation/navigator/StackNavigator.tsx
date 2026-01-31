import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TabNavigator from './TabNavigator';
import ContentDetailPage from '../../../presentation/pages/content-detail/ContentDetailPage';
import { PlayerPage } from '../../../presentation/pages/player/PlayerPage';
import ChannelDetailPage from '../../../presentation/pages/channel-detail/ChannelDetailPage';
import SearchPage from '../../../presentation/pages/search/SearchPage';
import ChannelSelectionPage from '../../../presentation/pages/channel-selection/ChannelSelectionPage';
import { MediaListPage } from '../../../presentation/pages/media/MediaListPage';
import { ImageDetailPage } from '../../../presentation/pages/media/ImageDetailPage';
import { RootStackParamList } from '../types';
import { routePages } from '../constant/routePages';
import colors from '@/shared/styles/colors';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function StackNavigator() {
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

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TabNavigator from './TabNavigator';
import ContentDetailPage from '../../../presentation/pages/content-detail/ContentDetailPage';
import { PlayerPage } from '../../../presentation/pages/player/PlayerPage';
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
    </Stack.Navigator>
  );
}

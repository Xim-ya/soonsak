import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TabNavigator from './TabNavigator';
import ContentDetailPage from '../../../presentation/pages/content-detail/ContentDetailPage';
import { RootStackParamList } from '../types';
import { routePages } from '../constant/routePages';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function StackNavigator() {
  return (
    <Stack.Navigator>
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
    </Stack.Navigator>
  );
}

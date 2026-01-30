import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../../../presentation/pages/home/HomePage';
import { Text } from 'react-native';
import { TabConfig, TabRoutes } from '../constant/tabConfigs';
import Explorepage from '../../../presentation/pages/explore/ExploreScreen';
import SoonsakPage from '../../../presentation/pages/soonsak/SoonsakPage';
import { TabParamList } from '../types';

const Tab = createBottomTabNavigator<TabParamList>();

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarLabel: ({ color }) => {
          return <Text style={{ color }}>{TabConfig[route.name as TabRoutes].label}</Text>;
        },
        tabBarIcon: ({ color, size }) => {
          const Icon = TabConfig[route.name as TabRoutes].icon;
          return <Icon width={size} height={size} fill={color} />;
        },
      })}
    >
      <Tab.Screen name={TabRoutes.Home} component={HomeScreen} />
      <Tab.Screen name={TabRoutes.Explore} component={Explorepage} />
      <Tab.Screen name={TabRoutes.Soonsak} component={SoonsakPage} />
    </Tab.Navigator>
  );
}

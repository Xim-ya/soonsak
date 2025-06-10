import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "../../../presentation/home/screen/HomeScreen";
import { Text } from "react-native";
import { TabConfig, TabRoutes } from "./constants/tabConfigs";
import ExploreScreen from "../../../presentation/explore/screen/ExploreScreen";


const Tab = createBottomTabNavigator();

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
            })}>
            <Tab.Screen name={TabRoutes.Home} component={HomeScreen} />
            <Tab.Screen name={TabRoutes.Explore} component={ExploreScreen} />
        </Tab.Navigator>
    );
}

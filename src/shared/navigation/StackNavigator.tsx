import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../../presentation/home/screen/HomeScreen";

const Stack = createNativeStackNavigator();

export default function StackNavgiator() {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Home" component={HomeScreen}></Stack.Screen>
        </Stack.Navigator>
    );
} 
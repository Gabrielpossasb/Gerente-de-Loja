import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoadingScreen from '../screens/LoadingScreen';
import Login from '../screens/login';
import TabRoutes from './tab.routes';

export type StackRoutesParamsList = {
    Loading: undefined;
    Login: undefined;
    Home: undefined;
};

const Stack = createNativeStackNavigator<StackRoutesParamsList>();

export default function StackRoutes() {

    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>

            <Stack.Screen
                name='Loading'
                component={LoadingScreen}
            />

            <Stack.Screen
                name='Login'
                component={Login}
            />

            <Stack.Screen
                name='Home'
                component={TabRoutes}
            />
        </Stack.Navigator>
    )
}
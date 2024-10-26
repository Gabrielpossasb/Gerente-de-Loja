import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import CadastroTrilha from "../components/CadastroScreen/CadastroDeTrilha/CadastroDeTrilha";
import CadastroUsuario from "../components/CadastroScreen/CadastroDeUsuario";
import CadastroDeVideo from "../components/CadastroScreen/CadastroDeVideo/CadastroDeVideo";
import CadastroScreen from "../screens/cadastro";
import EditVideo from "../components/CadastroScreen/EditVideo";
import EditUser from "../components/CadastroScreen/EditUser";
import EditTrilha from "../components/CadastroScreen/EditTrilha";

export type CadastroStackRoutesParamsList = {
    cadastro: undefined;
    cadastroVideo: undefined;
    editVideo: undefined;
    cadastroUsuario: undefined;
    editUsuario: { from?: 'ranking' | 'cadastro'};
    cadastroTrilha: undefined;
    editTrilha: undefined;
};

const Stack = createNativeStackNavigator<CadastroStackRoutesParamsList>();

export default function CadastroStackRoutes() {

    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen
                name='cadastro'
                component={CadastroScreen}
            />
            <Stack.Screen
                name='cadastroVideo'
                component={CadastroDeVideo}
            />
            <Stack.Screen
                name='editVideo'
                component={EditVideo}
            />
            <Stack.Screen
                name='cadastroUsuario'
                component={CadastroUsuario}
            />
            <Stack.Screen
                name='editUsuario'
                component={EditUser}
            />
            <Stack.Screen
                name='cadastroTrilha'
                component={CadastroTrilha}
            />
            <Stack.Screen
                name='editTrilha'
                component={EditTrilha}
            />
        </Stack.Navigator>
    )
}
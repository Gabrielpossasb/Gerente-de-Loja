import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import CadastroTrilha from "../components/CadastroScreen/CadastroDeTrilha";
import CadastroUsuario from "../components/CadastroScreen/CadastroDeUsuario";
import CadastroDeVideo from "../components/CadastroScreen/CadastroDeVideo/CadastroDeVideo";
import CadastroScreen from "../screens/cadastro";

export type CadastroStackRoutesParamsList = {
    cadastro: undefined;
    cadastroVideo: undefined;
    cadastroUsuario: undefined;
    cadastroTrilha: undefined;
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
                name='cadastroUsuario'
                component={CadastroUsuario}
            />
            <Stack.Screen
                name='cadastroTrilha'
                component={CadastroTrilha}
            />
        </Stack.Navigator>
    )
}
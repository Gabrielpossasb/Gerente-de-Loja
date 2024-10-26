import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Perguntas from "../components/TreinamentoScreen/Perguntas";
import Trilha from "../components/TreinamentoScreen/Trilha";
import VideoComponent from "../components/TreinamentoScreen/VideoComponent";
import Treinamento from "../screens/treinamento";
import { trilhaFixedType, trilhaSemanaType, VideoInfoProps } from "../types/customTypes";

export type TreinamentoStackRoutesParamsList = {
    Treinamento: undefined;
    Trilha: { key: 'semana' | 'fixa' };
    PlayerVideo: { videoID: string, uniqueID: string };
    Perguntas: { videoInfo: VideoInfoProps, uniqueID: string  };
};

const Stack = createNativeStackNavigator<TreinamentoStackRoutesParamsList>();

export default function TreinamentoStackRoutes() {

    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen
                name='Treinamento'
                component={Treinamento}
            />
            <Stack.Screen
                name='Trilha'
                component={Trilha}
            />
            <Stack.Screen
                name='PlayerVideo'
                component={VideoComponent}
            />
            <Stack.Screen
                name='Perguntas'
                component={Perguntas}
            />
        </Stack.Navigator>
    )
}
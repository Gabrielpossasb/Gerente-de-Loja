import Routes from "@/src/routes";
import { useNavigation } from "@react-navigation/native";
import { useEffect } from "react";
import { Alert, BackHandler, StatusBar } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import '../styles/global.css';

export default function Page() {

   const navigation = useNavigation();

   useEffect(() => {

      const onBackPress = () => {

         console.log(navigation.canGoBack())

         if (navigation.canGoBack()) {
            navigation.goBack();
         } else {
            Alert.alert(
               "Sair do aplicativo",
               "Você tem certeza que deseja sair?",
               [
                  {
                     text: "Não",
                     onPress: () => null,
                     style: "cancel",
                  },
                  {
                     text: "Sim",
                     onPress: () => BackHandler.exitApp(),
                  },
               ]
            );
         }
         return true;
      };

      const backHandler = BackHandler.addEventListener(
         'hardwareBackPress',
         onBackPress
      );

      return () => backHandler.remove();
   }, []);

   return (
      <GestureHandlerRootView style={{ flex: 1 }}>
         <StatusBar
            backgroundColor="#000" // Funciona apenas no Android
            barStyle="dark-content" // Define o estilo do conteúdo da StatusBar
         />
         <Routes />
      </GestureHandlerRootView>
   );
}
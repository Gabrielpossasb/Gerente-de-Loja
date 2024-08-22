import Routes from "@/src/routes";
import { Alert, BackHandler, StatusBar } from "react-native";
import '../styles/global.css'
import { useEffect } from "react";
import { NavigationProp, useNavigation } from "@react-navigation/native";

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
      <>
         <StatusBar
            backgroundColor="#000" // Funciona apenas no Android
            barStyle="dark-content" // Define o estilo do conteúdo da StatusBar
         />
         <Routes />
      </>
   );
}
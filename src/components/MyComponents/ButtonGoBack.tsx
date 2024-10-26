import { MaterialCommunityIcons } from "@expo/vector-icons";
import { NavigationProp, RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { MotiView } from "moti";
import { useEffect } from "react";
import { BackHandler, Pressable, Text, View } from "react-native";
import { CadastroStackRoutesParamsList } from "../../routes/cadastro.stack.routes";
import React from "react";
import { TabParamList } from "@/src/routes/tab.routes";

export default function ButtonGoBack() {

   const route = useRoute<RouteProp<CadastroStackRoutesParamsList, 'editUsuario'>>();
   const from = route.params?.from; // Uso de "?" para evitar erro se params for undefined
   
   const navigate = useNavigation<NavigationProp<TabParamList>>()
   const navigation = useNavigation<NavigationProp<CadastroStackRoutesParamsList>>()

   const onBackPress = () => {
      if (from === 'ranking') {
         navigate.reset({
            index: 0,
            routes: [{ name: 'Ranking' }],
         });
      } else if (navigation.canGoBack()) {
         // Volta normalmente se houver histórico de navegação
         navigation.goBack();
      } else {
         // Caso contrário, volta para a aba 'cadastro'
         navigation.navigate('cadastro');
      }
      return true;
   };

   useEffect(() => {
      const backHandler = BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () => backHandler.remove();
   }, [navigation]);

   return (
      <Pressable
         onPress={onBackPress}
         className="relative"

      >
         {({ pressed }) => (
            <>
               <View className="absolute top-2 left-0 right-0 -bottom-[6px] rounded-xl bg-yellow-500" />

               <MotiView
                  from={{ translateY: 0 }}
                  animate={{ translateY: pressed ? [6, 0] : 0 }}
                  transition={{ type: 'timing', duration: 200 }}

                  className="flex flex-row gap-1 items-center justify-center p-1 px-1 pr-3 rounded-xl bg-yellow-400"
               >
                  <MaterialCommunityIcons name="arrow-left" color={'#fff'} size={20} />

                  <View className="flex relative">
                     <Text className="font-bold text-white text-base">
                        Voltar
                     </Text>
                  </View>
               </MotiView>

            </>
         )}
      </Pressable>
   )
}
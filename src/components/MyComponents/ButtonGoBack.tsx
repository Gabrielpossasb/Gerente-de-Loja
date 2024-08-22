import { MaterialCommunityIcons } from "@expo/vector-icons";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { MotiView } from "moti";
import { useEffect } from "react";
import { BackHandler, Pressable, Text, View } from "react-native";
import { CadastroStackRoutesParamsList } from "../../routes/cadastro.stack.routes";

export default function ButtonGoBack() {

   const navigation = useNavigation<NavigationProp<CadastroStackRoutesParamsList>>()

   function customGoBack() {
      if (navigation.canGoBack()) {
         navigation.goBack();
      } else {
         // Volta para a aba 'CadastroStack' se estiver na aba errada
         navigation.navigate('cadastro');
      }
   }

   useEffect(() => {
      const onBackPress = () => {
         if (navigation.canGoBack()) {
            navigation.goBack();
         } else {
            // Volta para a aba 'CadastroStack' se estiver na aba errada
            navigation.navigate('cadastro');
         }
         return true;
      };

      const backHandler = BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () => backHandler.remove();
   }, [navigation]);

   return (
      <Pressable
         onPress={customGoBack}
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
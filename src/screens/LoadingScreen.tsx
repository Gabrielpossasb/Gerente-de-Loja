import { MaterialCommunityIcons } from "@expo/vector-icons";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { useContext, useEffect } from "react";
import { Image, View } from "react-native";
import { DataUserContext } from "../hook/useDataUser";
import { StackRoutesParamsList } from "../routes/stack.routes";
import { auth } from "../services/firebaseConfig";

export default function LoadingScreen() {

   const { userData, loading, getUserData } = useContext(DataUserContext)
   const navigation = useNavigation<NavigationProp<StackRoutesParamsList>>()

   useEffect(() => {

      const unsubscribe = auth.onAuthStateChanged(async (user) => {
         if (user) {
            await getUserData();
            navigation.reset({
               index: 0,
               routes: [{ name: 'Home' }],
            });
         } else {
            navigation.reset({
               index: 0,
               routes: [{ name: 'Login' }],
            });
         }
      });

      return () => unsubscribe();

   }, [])

   return (
      <View className="flex flex-1 items-center justify-center bg-white">
         <Image width={208} height={160} className="w-52 h-40 max-w-52 max-h-40 bg-contain" resizeMode="contain" source={require('../assets/images/logoDauryPNGmenor.png')} />
         <View className="flex items-center justify-center p-4 animate-spin">
            <MaterialCommunityIcons name="loading" size={60} color="#facc15" className="" />
         </View>
      </View>
   )
}
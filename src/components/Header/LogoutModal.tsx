import { StackRoutesParamsList } from "@/src/routes/stack.routes";
import { auth } from "@/src/services/firebaseConfig";
import { stylesShadow } from "@/src/styles/styles";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { signOut } from "firebase/auth";
import { Pressable, Text, View } from "react-native";
import Modal from "../Modal/Modal";

type LogoutModalPROPS = {
   closeModalLogout: () => void;
   handleLogout: boolean
}

export default function LogoutModal({ closeModalLogout, handleLogout }: LogoutModalPROPS) {

   const navigation = useNavigation<NavigationProp<StackRoutesParamsList>>()

   const logout = () => {
      signOut(auth)
      closeModalLogout()
      navigation.reset({
         index: 0,
         routes: [{ name: 'Login' }],
      });
   }

   return (
      <Modal id='Logout' isOpen={handleLogout}>
         <View className="bg-white w-4/5 flex p-6 items-center gap-6 rounded-xl shadow-lg">
            <View className="flex gap-10">
               <View className="flex flex-row w-full justify-between items-center">
                  <Text className="text-2xl font-bold">Sair da Conta</Text>

                  <Pressable onPress={closeModalLogout}>
                     <View className="bg-white rounded-full p-1" style={stylesShadow.shadow}>
                        <MaterialCommunityIcons name="close" size={20} color={'#000'} />
                     </View>
                  </Pressable>
               </View>

               <Text className=" text-gray-600 text-lg">Tem certeza que deseja sair?</Text>
            </View>

            <Pressable onPress={() => logout()} className="relative">
               <View className="bg-yellow-400 px-10 p-1 rounded-xl flex flex-row shadow-lg items-center justify-center gap-4">
                  <Text className="text-white text-2xl font-bold">SAIR</Text>
                  <MaterialCommunityIcons name="logout" size={28} color="#fff" />
               </View>

               <View className="absolute h-10 -z-10 left-0 right-0 -bottom-[4px] rounded-xl bg-yellow-500 " />
            </Pressable>

         </View>
      </Modal>
   )
}
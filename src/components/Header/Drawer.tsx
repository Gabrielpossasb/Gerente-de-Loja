import { DataUserContext } from "@/src/hook/useDataUser";
import { stylesShadow } from "@/src/styles/styles";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { MotiView } from "moti";
import { useContext, useEffect } from "react";
import { BackHandler, Pressable, Text, View } from "react-native";
import CustomButton from "../MyComponents/CustomButton";
import ItemDrawer from "./ItemDrawer";

type DrawerPROPS = {
   openDrawer: boolean;
   closeDrawer: () => void;
   openLogoutModal: () => void;
}

export default function Drawer({ openDrawer, closeDrawer, openLogoutModal }: DrawerPROPS) {

   const { userData } = useContext(DataUserContext)

   useEffect(() => {
      const onBackPress = () => {
         if (openDrawer) {
            closeDrawer();
            return true; // impede a ação padrão de voltar
         }
         return false; // permite a ação padrão de voltar
      };

      const backHandler = BackHandler.addEventListener(
         'hardwareBackPress',
         onBackPress
      );

      return () => backHandler.remove();
   }, [openDrawer]);

   return (
      <MotiView
         animate={{
            translateX: openDrawer ? 0 : 500,
         }}
         transition={{
            translateX: {
               mass: 0.6,
               delay: 50, // Aplica o delay somente ao abrir o Drawer
            },
         }}
         className="h-screen flex justify-end flex-row absolute -right-32 -left-20 z-20"
      >
         <MotiView
            animate={{ opacity: openDrawer ? 1 : 0, }}
            transition={{
               opacity: {
                  duration: 200,
                  type: 'timing',
                  delay: openDrawer ? 200 : 0, // Aplica o delay somente ao abrir o Drawer
               },
            }}
            className="flex flex-1 h-screen w-full bg-black/10 absolute"
         >
            <Pressable onPress={closeDrawer} className="flex flex-1 h-screen w-full" />
         </MotiView>

         <View
            style={stylesShadow.shadow}
            className="h-screen items-start w-3/4 -mr-20 mt-2 flex rounded-3xl bg-white"
         >
            <Pressable
               onPress={closeDrawer}
               className="p-6"
            >
               {({ pressed }) => (
                  <MotiView
                     animate={{ translateX: pressed ? 30 : 0 }}
                     transition={{ type: 'timing', duration: 200 }}
                     className="p-1 rounded-full bg-yellow-400"
                     style={stylesShadow.shadow}
                  >
                     <MaterialCommunityIcons name="arrow-right" size={32} color="#fff" />
                  </MotiView>
               )}
            </Pressable>

            <View className="flex w-full border-b-[1px] border-neutral-400">

               <ItemDrawer text="Trilha" screen="TreinamentoStack" closeDrawer={closeDrawer}>
                  <MaterialCommunityIcons name="map" size={24} color={'#facc15'} />
               </ItemDrawer>

               {userData.acesso == 'admin' && (
                  <ItemDrawer text="Cadastro" screen="CadastroStack" closeDrawer={closeDrawer}>
                     <MaterialCommunityIcons name="account-plus" size={24} color={'#facc15'} />
                  </ItemDrawer>
               )}

            </View>

            <View className="flex w-64 mt-10 items-center">
               <CustomButton color="yellow" submit={openLogoutModal} disable={false}>
                  <View className="p-1 px-6 rounded-xl flex flex-row items-center justify-center gap-4 bg-yellow-400">
                     <Text className="text-white text-2xl font-bold">Sair</Text>
                     <MaterialCommunityIcons name="logout" size={28} color="#fff" />
                  </View>
               </CustomButton>
            </View>

         </View>
      </MotiView>
   )
}